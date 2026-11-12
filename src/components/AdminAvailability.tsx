"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, LogOut } from "lucide-react";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import { services } from "@/data/services";
import { conflictReason, customSlot, fixedSlots, intervalLabel, isScheduleService, overlaps, validInterval, type ScheduleEntry, type ScheduleService, type ScheduleState } from "@/lib/schedule";

const authClient = createAuthClient();
const weekdays = ["L", "M", "M", "J", "V", "S", "D"];
const inputClass = "mt-2 block min-h-12 w-full min-w-0 border border-[#D8CDBD] bg-white p-3";
const dateKey = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export default function AdminAvailability({ adminName }: { adminName: string }) {
  const router = useRouter();
  const [visible, setVisible] = useState(() => {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit" }).formatToParts(new Date());
    return { year: Number(parts.find(p => p.type === "year")?.value), month: Number(parts.find(p => p.type === "month")?.value) - 1 };
  });
  const { year, month } = visible;
  const [date, setDate] = useState("");
  const [service, setService] = useState<ScheduleService>(services[0].slug);
  const [slotIndex, setSlotIndex] = useState<number | null>(null);
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("12:00");
  const [state, setState] = useState<ScheduleState>("reserved");
  const [result, setResult] = useState<{ key: string; entries: ScheduleEntry[]; error: string } | null>(null);
  const [revision, setRevision] = useState(0);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ error: boolean; text: string } | null>(null);
  const key = `${year}-${month}:${revision}`;
  const ready = result?.key === key;
  const entries = ready ? result.entries : [];
  const slot = service === "eventos-empresariales" ? customSlot(from, to) : slotIndex === null ? null : fixedSlots[service][slotIndex];
  const candidate = slot ? { service, date, start: slot.start, end: slot.end, state } : null;
  const conflict = candidate && date && validInterval(service, candidate.start, candidate.end) ? conflictReason(candidate, entries) : null;
  const dayEntries = entries.filter(entry => date && overlaps(
    { service, date, start: 0, end: 1440, state: "reserved" }, entry,
  ));
  const title = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month, 1)));
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/availability?year=${year}&month=${month + 1}`, { cache: "no-store", signal: controller.signal })
      .then(async response => {
        const body = await response.json() as { entries?: ScheduleEntry[]; error?: string };
        if (!response.ok || !Array.isArray(body.entries)) throw new Error(body.error || "No se pudo cargar la agenda.");
        setResult({ key, entries: body.entries, error: "" });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setResult({ key, entries: [], error: error instanceof Error ? error.message : "No se pudo cargar la agenda." });
      });
    return () => controller.abort();
  }, [year, month, key]);

  function moveMonth(amount: number) {
    const next = new Date(Date.UTC(year, month + amount, 1));
    if (next.getUTCFullYear() < 2000 || next.getUTCFullYear() > 2100) return;
    setVisible({ year: next.getUTCFullYear(), month: next.getUTCMonth() });
    setDate("");
    setNotice(null);
  }

  async function save(payload: object) {
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/availability", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error || "No se pudo guardar el cambio.");
      setNotice({ error: false, text: "Agenda actualizada. Las disponibilidades se recalculan para los tres servicios." });
    } catch (error) {
      setNotice({ error: true, text: error instanceof Error ? error.message : "No se pudo guardar el cambio." });
    } finally {
      setRevision(value => value + 1);
      setSaving(false);
    }
  }

  async function signOut() {
    try {
      const response = await authClient.signOut();
      if (response.error) throw new Error(response.error.message);
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("[admin] Sign-out request failed:", error);
      setNotice({ error: true, text: "No se pudo cerrar la sesión. Intentá nuevamente." });
    }
  }

  return <main className="min-h-screen bg-[#F8F6EF] px-5 py-10 text-[#5A4731] sm:px-8 lg:px-14">
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#D8CDBD] pb-6">
        <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#3F8FB7]">CAICOS / Administración</p><h1 className="serif-display mt-2 text-4xl sm:text-5xl">Agenda compartida</h1><p className="mt-2 text-sm">Sesión iniciada como {adminName}</p></div>
        <button type="button" onClick={signOut} className="inline-flex min-h-11 items-center gap-2 border border-[#D8CDBD] px-4 text-sm"><LogOut size={16} /> Cerrar sesión</button>
      </header>
      <p className="mb-6 text-sm leading-relaxed">Una sola agenda para los tres servicios. Infantil: 14–17 y 18–21. Social: 21–03 del día siguiente. Una reserva infantil impide un social en esa misma fecha y viceversa. Empresariales: horario personalizado sin superposición con reservas.</p>
      {notice && <p role={notice.error ? "alert" : "status"} className={`mb-5 border p-3 text-sm ${notice.error ? "border-red-300 bg-red-50 text-red-800" : "border-green-300 bg-green-50 text-green-800"}`}>{notice.text}</p>}
      {ready && result.error && <p role="alert" className="mb-5 border border-red-300 bg-red-50 p-3 text-red-800">{result.error}</p>}
      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section aria-label="Calendario compartido" className="min-w-0 border border-[#D8CDBD] bg-white p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-2">
            <button type="button" disabled={saving} onClick={() => moveMonth(-1)} aria-label="Mes anterior" className="flex size-11 shrink-0 items-center justify-center border"><ArrowLeft size={18} /></button>
            <h2 className="text-center text-base font-bold capitalize" aria-live="polite">{title}</h2>
            <button type="button" disabled={saving} onClick={() => moveMonth(1)} aria-label="Mes siguiente" className="flex size-11 shrink-0 items-center justify-center border"><ArrowRight size={18} /></button>
          </div>
          {!ready ? <p role="status" className="py-16 text-center">Cargando agenda…</p> : !result.error && <div className="grid grid-cols-7 gap-1">
            {weekdays.map((day, index) => <span key={index} className="py-2 text-center text-xs font-bold">{day}</span>)}
            {Array.from({ length: firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}
            {Array.from({ length: days }, (_, index) => {
              const value = dateKey(year, month, index + 1);
              const records = entries.filter(entry => overlaps({ service, date: value, start: 0, end: 1440, state: "reserved" }, entry));
              const reserved = records.some(entry => entry.state === "reserved");
              return <button type="button" key={value} disabled={saving} aria-label={`${value}, ${records.length} registros`} aria-pressed={date === value} onClick={() => { setDate(value); setSlotIndex(null); setNotice(null); }} className={`flex min-h-12 flex-col items-center justify-center border p-1 text-sm ${date === value ? "border-[#3F8FB7] bg-[#3F8FB7] text-white" : reserved ? "border-red-300 bg-red-50" : records.length ? "border-amber-300 bg-amber-50" : "border-green-300 bg-green-50"}`}>{index + 1}<span className="text-[9px]">{records.length ? `${records.length} reg.` : "Libre"}</span></button>;
            })}
          </div>}
          <p className="mt-4 text-xs leading-relaxed">Verde: sin registros. Rojo: hay reservas. Amarillo: solo bloqueos. Un día con reservas puede tener otros horarios libres; seleccioná la fecha para verlos.</p>
        </section>
        <section aria-label="Horarios del día" className="min-w-0 border border-[#D8CDBD] bg-white p-4 sm:p-6">
          {!date ? <p>Seleccioná una fecha para gestionar sus horarios.</p> : <>
            <h2 className="serif-display text-3xl">{date.split("-").reverse().join("/")}</h2>
            <form className="mt-5 space-y-4" onSubmit={event => { event.preventDefault(); if (!candidate) { setNotice({ error: true, text: "Seleccioná un turno antes de guardar." }); return; } void save({ action: "add", ...candidate }); }}>
              <label className="block text-sm font-bold">Servicio<select value={service} onChange={event => { if (isScheduleService(event.target.value)) setService(event.target.value); setSlotIndex(null); }} className={inputClass}>{services.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
              {service === "eventos-empresariales" ? <div>
                <div className="grid grid-cols-2 gap-3"><label className="text-sm font-bold">Desde<input required type="time" value={from} onChange={event => setFrom(event.target.value)} className={inputClass} /></label><label className="text-sm font-bold">Hasta<input required type="time" value={to} onChange={event => setTo(event.target.value)} className={inputClass} /></label></div>
                <p className="mt-2 text-xs">Si el fin es anterior al inicio, termina al día siguiente. Inicio y fin no pueden ser iguales.</p>
              </div> : <label className="block text-sm font-bold">Turno<select required value={slotIndex ?? ""} onChange={event => setSlotIndex(event.target.value === "" ? null : Number(event.target.value))} className={inputClass}><option value="" disabled>Selecciona</option>{fixedSlots[service].map((item, index) => <option key={item.start} value={index}>{item.label}</option>)}</select></label>}
              <label className="block text-sm font-bold">Estado<select value={state} onChange={event => { if (event.target.value === "reserved" || event.target.value === "blocked") setState(event.target.value); }} className={inputClass}><option value="reserved">Reservado</option><option value="blocked">No disponible (sin reserva)</option></select></label>
              <p className="text-xs leading-relaxed">“No disponible” cierra solo este servicio en ese horario; no activa la incompatibilidad infantil/social. Las reservas bloquean también los horarios superpuestos de otros servicios.</p>
              {conflict && <p role="alert" className="text-sm text-red-800">{conflict}</p>}
              <button type="submit" disabled={saving || !ready || Boolean(result?.error) || Boolean(conflict) || !slot || !validInterval(service, slot.start, slot.end)} className="min-h-12 w-full bg-[#3F8FB7] p-3 text-sm font-bold text-white disabled:opacity-40">{saving ? "Guardando…" : "Guardar horario"}</button>
            </form>
            <h3 className="mt-8 font-bold">Registros que afectan este día</h3>
            {!dayEntries.length && ready && !result.error && <p className="mt-3 text-sm">Sin reservas ni bloqueos.</p>}
            <ul className="mt-3 space-y-3">{dayEntries.map(entry => <li key={entry.id} className="border border-[#D8CDBD] p-3 text-sm">
              <p className="font-semibold">{services.find(item => item.slug === entry.service)?.name}</p>
              <p className="mt-1">{entry.date === date ? "" : `${entry.date} · `}{intervalLabel(entry.start, entry.end)}</p>
              <p className="mt-1">{entry.state === "reserved" ? "Reservado" : "No disponible (sin reserva)"}</p>
              <button type="button" disabled={saving || !ready} onClick={() => { if (window.confirm("¿Quitar este registro y liberar su horario?")) void save({ action: "remove", id: entry.id }); }} className="mt-2 min-h-11 border border-[#D8CDBD] px-3 text-sm disabled:opacity-40">Quitar y liberar</button>
            </li>)}</ul>
          </>}
        </section>
      </div>
    </div>
  </main>;
}
