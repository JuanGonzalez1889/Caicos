import { NextRequest, NextResponse } from "next/server";
import { getMySqlPool, isMySqlConfigured } from "@/lib/db";
import { readSchedule } from "@/lib/schedule-db";

export async function GET(request: NextRequest) {
  const year = Number(request.nextUrl.searchParams.get("year"));
  const month = Number(request.nextUrl.searchParams.get("month"));

  if (!Number.isInteger(year) || year < 2000 || year > 2100 ||
      !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Parámetros de disponibilidad inválidos." }, { status: 400 });
  }

  if (!isMySqlConfigured()) {
    return NextResponse.json({ error: "La disponibilidad todavía no está configurada." }, { status: 503 });
  }

  try {
    const from = new Date(Date.UTC(year, month - 1, 0)).toISOString().slice(0, 10);
    const to = new Date(Date.UTC(year, month, 2)).toISOString().slice(0, 10);
    const entries = await readSchedule(getMySqlPool(), from, to);
    return NextResponse.json({ entries }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[availability] Failed to load availability:", error);
    return NextResponse.json({ error: "No se pudo consultar la disponibilidad." }, { status: 503 });
  }
}
