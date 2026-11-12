export type ScheduleService = "eventos-infantiles" | "eventos-sociales" | "eventos-empresariales";
export type ScheduleState = "reserved" | "blocked";
export type ScheduleEntry = {
  id: number;
  service: ScheduleService;
  date: string;
  start: number;
  end: number;
  state: ScheduleState;
};
export type ScheduleSlot = { start: number; end: number; label: string };
export type ScheduleCandidate = Omit<ScheduleEntry, "id">;

export const fixedSlots: Record<Exclude<ScheduleService, "eventos-empresariales">, ScheduleSlot[]> = {
  "eventos-infantiles": [
    { start: 840, end: 1020, label: "14:00 a 17:00" },
    { start: 1080, end: 1260, label: "18:00 a 21:00" },
  ],
  "eventos-sociales": [{ start: 1260, end: 1620, label: "21:00 a 03:00 del día siguiente" }],
};

export function isScheduleService(value: unknown): value is ScheduleService {
  return value === "eventos-infantiles" || value === "eventos-sociales" || value === "eventos-empresariales";
}

export function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value &&
    Number(value.slice(0, 4)) >= 2000 && Number(value.slice(0, 4)) <= 2100;
}

export function validInterval(service: ScheduleService, start: unknown, end: unknown): boolean {
  if (typeof start !== "number" || typeof end !== "number" || !Number.isInteger(start) ||
      !Number.isInteger(end) || start < 0 || start >= 1440 || end <= start || end > start + 1440) return false;
  return service === "eventos-empresariales" || fixedSlots[service].some(slot => slot.start === start && slot.end === end);
}

export function timeMinutes(value: string): number {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return NaN;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function customSlot(from: string, to: string): ScheduleSlot {
  const start = timeMinutes(from);
  const finish = timeMinutes(to);
  const end = finish < start ? finish + 1440 : finish;
  return { start, end, label: `${from} a ${to}${end > 1440 ? " del día siguiente" : ""}` };
}

export function intervalLabel(start: number, end: number): string {
  const time = (minute: number) => `${String(Math.floor(minute % 1440 / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
  return `${time(start)} a ${time(end)}${end >= 1440 ? " del día siguiente" : ""}`;
}

export function overlaps(a: ScheduleCandidate, b: ScheduleCandidate): boolean {
  const dayA = Date.parse(`${a.date}T00:00:00Z`) / 60000;
  const dayB = Date.parse(`${b.date}T00:00:00Z`) / 60000;
  return dayA + a.start < dayB + b.end && dayB + b.start < dayA + a.end;
}

export function conflictReason(candidate: ScheduleCandidate, entries: ScheduleEntry[]): string | null {
  for (const entry of entries) {
    if (candidate.state === "blocked" || entry.state === "blocked") {
      if (candidate.service === entry.service && overlaps(candidate, entry)) {
        return "Ese horario ya está reservado o marcado como no disponible para este servicio.";
      }
      continue;
    }
    if (candidate.date === entry.date &&
        ((candidate.service === "eventos-infantiles" && entry.service === "eventos-sociales") ||
         (candidate.service === "eventos-sociales" && entry.service === "eventos-infantiles"))) {
      return "No se pueden reservar eventos infantiles y sociales en la misma fecha.";
    }
    if (overlaps(candidate, entry)) return "El horario se superpone con una reserva de la agenda compartida.";
  }
  return null;
}

export function availableSlots(service: ScheduleService, date: string, entries: ScheduleEntry[], enterprise: ScheduleSlot): ScheduleSlot[] {
  const slots = service === "eventos-empresariales" ? [enterprise] : fixedSlots[service];
  return slots.filter(slot => validInterval(service, slot.start, slot.end) &&
    !conflictReason({ service, date, start: slot.start, end: slot.end, state: "reserved" }, entries));
}
