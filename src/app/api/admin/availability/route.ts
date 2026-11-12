import { NextRequest, NextResponse } from "next/server";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { auth, isAuthConfigured } from "@/lib/auth";
import { getMySqlPool, isMySqlConfigured } from "@/lib/db";

import { conflictReason, isScheduleService, isValidDate, validInterval } from "@/lib/schedule";
import { readSchedule } from "@/lib/schedule-db";

export async function POST(request: NextRequest) {
  if (!isMySqlConfigured() || !isAuthConfigured() || !auth) {
    return NextResponse.json({ error: "El panel de administración no está configurado." }, { status: 503 });
  }

  const origin = request.headers.get("origin");
  const trustedOrigin = new URL(process.env.BETTER_AUTH_URL || request.nextUrl.origin).origin;
  let requestOrigin = "";
  try {
    if (origin) requestOrigin = new URL(origin).origin;
  } catch {
    return NextResponse.json({ error: "Origen de solicitud no permitido." }, { status: 403 });
  }
  if (!requestOrigin || requestOrigin !== trustedOrigin) {
    return NextResponse.json({ error: "Origen de solicitud no permitido." }, { status: 403 });
  }

  let session;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch (error) {
    console.error("[admin/availability] Failed to validate admin session:", error);
    return NextResponse.json({ error: "No se pudo verificar la sesión de administración." }, { status: 503 });
  }
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Se requiere una cuenta administradora." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo de la solicitud no es válido." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "El cuerpo de la solicitud no es válido." }, { status: 400 });
  }

  const { action, id, service, date, start, end, state } = body as {
    action?: unknown;
    id?: unknown;
    service?: unknown;
    date?: unknown;
    start?: unknown;
    end?: unknown;
    state?: unknown;
  };
  const removing = action === "remove";
  if (removing ? typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0 :
      action !== "add" || !isScheduleService(service) || !isValidDate(date) ||
      !validInterval(service, start, end) || (state !== "reserved" && state !== "blocked")) {
    return NextResponse.json({ error: "Los datos de disponibilidad son inválidos." }, { status: 400 });
  }

  let connection: PoolConnection | undefined;
  try {
    connection = await getMySqlPool().getConnection();
    await connection.beginTransaction();
    const [lock] = await connection.query<RowDataPacket[]>("SELECT id FROM schedule_lock WHERE id = 1 FOR UPDATE");
    if (lock.length !== 1) throw new Error("Falta inicializar el bloqueo de la agenda compartida.");
    if (removing) {
      if (typeof id !== "number") throw new Error("El identificador del registro no es válido.");
      const [result] = await connection.execute<ResultSetHeader>("DELETE FROM schedule_entries WHERE id = ?", [id]);
      if (!result.affectedRows) {
        await connection.rollback();
        return NextResponse.json({ error: "El registro ya no existe. Actualizá la agenda." }, { status: 409 });
      }
    } else {
      if (!isScheduleService(service) || !isValidDate(date) || typeof start !== "number" ||
          typeof end !== "number" || (state !== "reserved" && state !== "blocked")) {
        await connection.rollback();
        return NextResponse.json({ error: "Los datos de disponibilidad son inválidos." }, { status: 400 });
      }
      const from = new Date(Date.parse(`${date}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
      const to = new Date(Date.parse(`${date}T00:00:00Z`) + 172800000).toISOString().slice(0, 10);
      const entries = await readSchedule(connection, from, to);
      const conflict = conflictReason({ service, date, start, end, state }, entries);
      if (conflict) {
        await connection.rollback();
        return NextResponse.json({ error: conflict }, { status: 409 });
      }
      await connection.execute(
        `INSERT INTO schedule_entries (service_slug, event_date, start_minute, end_minute, state, updated_by)
         VALUES (?, ?, ?, ?, ?, ?)`, [service, date, start, end, state, session.user.email],
      );
    }
    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); }
      catch (rollbackError) { console.error("[admin/availability] Failed to roll back:", rollbackError); }
    }
    console.error("[admin/availability] Failed to save availability:", error);
    return NextResponse.json({ error: "No se pudo guardar la disponibilidad." }, { status: 503 });
  } finally {
    connection?.release();
  }
}
