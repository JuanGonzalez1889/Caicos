import type { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import { isScheduleService, isValidDate, type ScheduleEntry } from "./schedule";

type ScheduleRow = RowDataPacket & ScheduleEntry;

export async function readSchedule(db: Pool | PoolConnection, from: string, to: string): Promise<ScheduleEntry[]> {
  const [rows] = await db.execute<ScheduleRow[]>(
    `SELECT id, service_slug AS service, DATE_FORMAT(event_date, '%Y-%m-%d') AS date,
       start_minute AS start, end_minute AS end, state
     FROM schedule_entries WHERE event_date >= ? AND event_date < ? ORDER BY event_date, start_minute, id`,
    [from, to],
  );
  return rows.map(row => {
    if (!isScheduleService(row.service) || !["reserved", "blocked"].includes(row.state) ||
        !isValidDate(row.date) || !Number.isInteger(row.start) || !Number.isInteger(row.end) ||
        row.start < 0 || row.start >= 1440 || row.end <= row.start || row.end > row.start + 1440) {
      throw new Error("La agenda contiene registros inválidos.");
    }
    return { id: row.id, service: row.service, date: row.date, start: row.start, end: row.end, state: row.state };
  });
}
