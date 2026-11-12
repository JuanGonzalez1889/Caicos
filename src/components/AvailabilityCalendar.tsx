"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { availableSlots, conflictReason, customSlot, fixedSlots, intervalLabel, type ScheduleEntry, type ScheduleService } from "@/lib/schedule";

type ArgDate = { year: number; month: number; day: number };
type Month = { year: number; month: number }; // month 0..11
type AvailabilityResult = { key: string; entries: ScheduleEntry[]; error: string };

const weekdays = ["L", "M", "M", "J", "V", "S", "D"];
const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

// La fecha se calcula en el navegador después de hidratar, siempre en huso horario de Argentina.
function argentinaToday(): ArgDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

function shiftMonth(value: Month, amount: number): Month {
  const next = new Date(Date.UTC(value.year, value.month + amount, 1));
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() };
}

function displayDate(iso: string) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export default function AvailabilityCalendar({ initialService = "eventos-infantiles", compactSpacing = false }: { initialService?: string; compactSpacing?: boolean }) {
  const todayKey = useSyncExternalStore(
    () => () => {},
    () => {
      const current = argentinaToday();
      return `${current.year}-${pad(current.month)}-${pad(current.day)}`;
    },
    () => "",
  );
  const today = todayKey
    ? { year: Number(todayKey.slice(0, 4)), month: Number(todayKey.slice(5, 7)), day: Number(todayKey.slice(8, 10)) }
    : null;
  const [monthOffset, setMonthOffset] = useState(0);
  const visible = today ? shiftMonth({ year: today.year, month: today.month - 1 }, monthOffset) : null;
  const [selectedService, setSelectedService] = useState<ScheduleService>(services.find((s) => s.slug === initialService)?.slug ?? services[0].slug);
  const [selectedStart, setSelectedStart] = useState<number | null>(null);
  const [enterpriseFrom, setEnterpriseFrom] = useState("09:00");
  const [enterpriseTo, setEnterpriseTo] = useState("12:00");
  const enterpriseSlot = customSlot(enterpriseFrom, enterpriseTo);
  const [selectedDate, setSelectedDate] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const calendarCard = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);
  useLayoutEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    calendarCard.current?.focus({ preventScroll: true });
    calendarCard.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [step]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitError, setSubmitError] = useState("");

  const requestYear = visible?.year;
  const requestMonth = visible?.month;
  const availabilityKey = requestYear !== undefined && requestMonth !== undefined
    ? `${requestYear}-${pad(requestMonth + 1)}`
    : "";
  const availabilityReady = availabilityResult?.key === availabilityKey;
  const availabilityError = availabilityReady ? availabilityResult.error : "";
  const availabilityLoading = Boolean(availabilityKey) && !availabilityReady;
  const entries = availabilityReady ? availabilityResult.entries : [];
  const reservations = entries.filter(entry => entry.state === "reserved");
  const hasManualBlocks = entries.some(entry => entry.state === "blocked" && entry.service === selectedService);
  const selectedSlots = selectedDate ? availableSlots(selectedService, selectedDate, entries, enterpriseSlot) : [];
  const selectedSlot = selectedSlots.find(slot => slot.start === selectedStart);

  useEffect(() => {
    if (requestYear === undefined || requestMonth === undefined) return;
    const key = `${requestYear}-${pad(requestMonth + 1)}`;
    const controller = new AbortController();

    fetch(`/api/availability?year=${requestYear}&month=${requestMonth + 1}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json() as { entries?: ScheduleEntry[]; error?: string };
        if (!response.ok) throw new Error(result.error || "No se pudo consultar la disponibilidad.");
        if (!Array.isArray(result.entries)) {
          throw new Error("La respuesta de disponibilidad no es válida.");
        }
        setAvailabilityResult({ key, entries: result.entries, error: "" });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setAvailabilityResult({
            key,
            entries: [],
            error: error instanceof Error ? error.message : "No se pudo consultar la disponibilidad.",
          });
        }
      });

    return () => controller.abort();
  }, [requestYear, requestMonth]);

  const currentService = services.find((s) => s.slug === selectedService);
  const firstWeekday = visible ? (new Date(Date.UTC(visible.year, visible.month, 1)).getUTCDay() + 6) % 7 : 0;
  const totalDays = visible ? new Date(Date.UTC(visible.year, visible.month + 1, 0)).getUTCDate() : 0;
  const currentMonth = Boolean(today && visible && (visible.year > today.year || (visible.year === today.year && visible.month >= today.month - 1)));
  const canGoBack = Boolean(today && visible && (visible.year > today.year || (visible.year === today.year && visible.month > today.month - 1)));
  const title = visible ? new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(visible.year, visible.month, 1, 12))) : "Calendario";

  function changeService(slug: typeof selectedService) {
    setSelectedService(slug);
    setSelectedDate("");
    setSelectedStart(null);
    setSubmitError("");
  }
  function moveMonth(delta: number) {
    if (!visible) return;
    setMonthOffset((current) => current + delta);
    setSelectedDate("");
    setSelectedStart(null);
  }
  function makeMessage() {
    return `¡Hola! Quisiera consultar disponibilidad en CAICOS MULTIEVENTOS.\n\nServicio: ${currentService?.name ?? ""}\nFecha: ${displayDate(selectedDate)}\nHorario: ${selectedSlot ? intervalLabel(selectedSlot.start, selectedSlot.end) : ""}\nNombre: ${name.trim()}\nTeléfono: ${phone.trim()}\n\n¿Podrían confirmarme la disponibilidad y brindarme más información? ¡Gracias!`;
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot || !availabilityReady || availabilityError || !name.trim() || !phone.trim()) {
      setSubmitError("No se pudo preparar la consulta. Revisá la fecha, el horario y tus datos.");
      return;
    }
    const message = makeMessage();
    setSubmitError("");
    window.open(`https://wa.me/5493476596260?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return <section id="disponibilidad" className={`scroll-mt-20 bg-[#F8F6EF] px-6 sm:px-10 lg:px-16 ${compactSpacing ? "pb-24 lg:pb-36" : "py-24 lg:py-36"}`}>
    <div className={`mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 ${compactSpacing ? "border-t border-[#5A4731]/20 pt-10 lg:pt-12" : ""}`}>
      <div className="lg:pt-16"><p className="text-xs font-bold uppercase tracking-[.3em] text-[#3F8FB7]">03 / Tu próximo evento</p>
        <h2 className="serif-display mt-7 max-w-[650px] text-[clamp(3.4rem,6vw,7.2rem)] leading-[1.01] tracking-[-.05em]">Elegí la fecha.<br/><em className="text-[#3F8FB7]">El resto empieza acá.</em></h2>
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#5A4731]/80">Seleccioná el servicio, elegí una fecha y contanos los detalles esenciales. Te ayudamos a dar el próximo paso por WhatsApp.</p>
        <p className="mt-8 max-w-md border-l-2 border-[#3F8FB7] pl-5 text-sm leading-relaxed text-[#5A4731]/75">Cada gran celebración empieza con una idea. Contanos la tuya y te acompañamos a hacerla realidad.</p>
      </div>
      <div ref={calendarCard} tabIndex={-1} role="region" aria-label="Consulta de fecha y horario" className="scroll-mt-28 border border-[#D8CDBD] bg-white p-5 shadow-[0_26px_70px_-45px_rgba(55,35,15,.4)] focus-visible:outline-2 focus-visible:outline-[#3F8FB7] sm:p-9 lg:p-11">
        {step === 1 ? <>
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#D8CDBD] pb-6"><div><h3 className="text-xl font-semibold text-[#5A4731]">Consultá tu fecha</h3><p className="mt-1 text-sm text-[#776451]">Paso 1 de 2 · Servicio y fecha</p></div><Image src="/images/caicos-logo.png" width={1454} height={825} alt="CAICOS Multieventos" className="h-auto w-16 shrink-0" /></div>
          <p className="mb-3 text-sm font-bold text-[#5A4731]">Servicio de interés</p>
          <div role="group" aria-label="Servicio de interés" className="grid grid-cols-3 gap-2 sm:gap-3">
            {services.map((service) => <button key={service.slug} type="button" aria-pressed={selectedService === service.slug} onClick={() => changeService(service.slug)} className={`min-h-14 border px-2 py-3 text-center text-[11px] font-bold leading-tight transition-colors sm:text-sm ${selectedService === service.slug ? "border-[#5A4731] bg-[#5A4731] text-white" : "border-[#D8CDBD] bg-white text-[#5A4731] hover:border-[#3F8FB7] hover:bg-[#F8F6EF]"}`}>{service.name}</button>)}
          </div>
          {selectedService === "eventos-empresariales" && <div className="mt-5">
            <p className="mb-3 text-sm text-[#776451]">Indicá el horario para ver las fechas disponibles. Si termina antes de la hora de inicio, finaliza al día siguiente.</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">Desde<input type="time" required value={enterpriseFrom} onChange={event => { setEnterpriseFrom(event.target.value); setSelectedDate(""); setSelectedStart(null); }} className="mt-2 block min-h-11 w-full min-w-0 border border-[#D8CDBD] p-2" /></label>
              <label className="text-sm font-semibold">Hasta<input type="time" required value={enterpriseTo} onChange={event => { setEnterpriseTo(event.target.value); setSelectedDate(""); setSelectedStart(null); }} className="mt-2 block min-h-11 w-full min-w-0 border border-[#D8CDBD] p-2" /></label>
            </div>
            {(!Number.isFinite(enterpriseSlot.end) || enterpriseSlot.end === enterpriseSlot.start) && <p role="alert" className="mt-2 text-sm text-red-800">Elegí un inicio y un fin diferentes y válidos.</p>}
          </div>}
          <div className="mt-10 flex items-center justify-between gap-3"><button type="button" onClick={() => moveMonth(-1)} disabled={!canGoBack} aria-label="Mes anterior" className="flex size-11 items-center justify-center border border-[#D8CDBD] text-[#5A4731] transition-colors hover:bg-[#F8F6EF] disabled:cursor-not-allowed disabled:opacity-25"><ArrowLeft size={19}/></button><p aria-live="polite" className="text-base font-bold capitalize text-[#5A4731]">{title}</p><button type="button" onClick={() => moveMonth(1)} disabled={!visible} aria-label="Mes siguiente" className="flex size-11 items-center justify-center border border-[#D8CDBD] text-[#5A4731] transition-colors hover:bg-[#F8F6EF] disabled:opacity-25"><ArrowRight size={19}/></button></div>
          {!today || !visible || availabilityLoading ? <div className="mt-8 grid min-h-72 place-items-center bg-[#F8F6EF] text-sm text-[#776451]" aria-live="polite">Cargando disponibilidad…</div> : availabilityError ? (
            <p role="alert" className="mt-8 min-h-40 border border-red-300 bg-red-50 p-5 text-sm leading-relaxed text-red-900">{availabilityError} Las fechas permanecen deshabilitadas hasta que se pueda verificar el calendario.</p>
          ) : <>
            <div className="mt-7 grid grid-cols-7 gap-1.5 sm:gap-2">{weekdays.map((day, index) => <span key={`${day}-${index}`} className="py-2 text-center text-xs font-bold text-[#5A4731]">{day}</span>)}
              {Array.from({ length: firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}
              {Array.from({ length: totalDays }, (_, index) => {
                const day = index + 1;
                const key = dateKey(visible.year, visible.month, day);
                const past = key < `${today.year}-${pad(today.month)}-${pad(today.day)}`;
                const occupied = availableSlots(selectedService, key, entries, enterpriseSlot).length === 0;
                const reserved = occupied && availableSlots(selectedService, key, reservations, enterpriseSlot).length === 0;
                const dayStatus = past ? "fecha pasada" : occupied ? reserved ? "reservado" : "no disponible" : "disponible";
                const disabled = past || occupied || !currentMonth;
                const selected = selectedDate === key;
                return <button key={key} type="button" disabled={disabled} aria-label={`${day} de ${title}, ${dayStatus}`} aria-pressed={selected} onClick={() => { setSelectedDate(key); setSelectedStart(null); }} className={`aspect-square min-w-0 border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#3F8FB7] ${selected ? "border-[#3F8FB7] bg-[#3F8FB7] text-white" : past ? "cursor-not-allowed border-[#E8E3DB] bg-[#F2EFEA] text-[#9A8C7C]" : occupied ? reserved ? "cursor-not-allowed border-red-300 bg-red-50 text-red-900" : "cursor-not-allowed border-amber-300 bg-amber-50 text-amber-900" : disabled ? "cursor-not-allowed border-[#E8E3DB] bg-[#F2EFEA] text-[#9A8C7C]" : "border-green-300 bg-green-50 text-green-900 hover:bg-green-100"}`}>{day}</button>;
              })}
            </div>
          </>}
          {!availabilityLoading && !availabilityError && <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#776451]" aria-label="Referencia de disponibilidad">
            <span><span className="mr-2 inline-block size-3 border border-green-300 bg-green-50 align-middle" />Disponible</span>
            <span><span className="mr-2 inline-block size-3 border border-red-300 bg-red-50 align-middle" />Reservado</span>
            {hasManualBlocks && <span><span className="mr-2 inline-block size-3 border border-amber-300 bg-amber-50 align-middle" />No disponible</span>}
          </div>}
          {selectedDate && availabilityReady && !availabilityError && <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-bold">Horario para el {displayDate(selectedDate)}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(selectedService === "eventos-empresariales" ? [enterpriseSlot] : fixedSlots[selectedService]).map(slot => {
                const available = selectedSlots.some(item => item.start === slot.start);
                const reserved = !available && Boolean(conflictReason(
                  { service: selectedService, date: selectedDate, start: slot.start, end: slot.end, state: "reserved" },
                  reservations,
                ));
                return <button type="button" key={slot.start} disabled={!available} aria-pressed={selectedStart === slot.start} onClick={() => setSelectedStart(slot.start)} className={`min-h-12 border p-3 text-sm disabled:opacity-40 ${selectedStart === slot.start ? "border-[#3F8FB7] bg-[#3F8FB7] text-white" : "border-[#D8CDBD]"}`}>{slot.label}{!available ? reserved ? " · Reservado" : " · No disponible" : ""}</button>;
              })}
            </div>
          </fieldset>}
          <button type="button" disabled={!selectedSlot || !availabilityReady || Boolean(availabilityError)} onClick={() => setStep(2)} className="mt-7 flex min-h-14 w-full items-center justify-center gap-3 bg-[#3F8FB7] px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-[#28789f] disabled:cursor-not-allowed disabled:opacity-40">Continuar <ArrowRight size={18}/></button>
        </> : <>
          <button type="button" onClick={() => { setStep(1); setSubmitError(""); }} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#5A4731] hover:text-[#3F8FB7]"><ArrowLeft size={17}/> Cambiar fecha</button>
          <h3 className="serif-display text-4xl text-[#5A4731]">Contanos sobre tu evento.</h3><p className="mt-2 text-sm text-[#776451]">Paso 2 de 2 · Tus datos</p>
          <div className="mt-7 bg-[#F8F6EF] p-5 text-sm text-[#5A4731]"><strong>{currentService?.name}</strong><p className="mt-1 capitalize">{displayDate(selectedDate)}</p><p className="mt-1">{selectedSlot ? intervalLabel(selectedSlot.start, selectedSlot.end) : "El horario ya no está disponible. Volvé a elegir fecha."}</p></div>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-bold text-[#5A4731]">Nombre y apellido<input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className="mt-2 block min-h-12 w-full border border-[#D8CDBD] bg-white px-4 py-3 font-normal outline-[#3F8FB7]"/></label>
            <label className="block text-sm font-bold text-[#5A4731]">Teléfono<input required type="tel" minLength={6} value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 block min-h-12 w-full border border-[#D8CDBD] bg-white px-4 py-3 font-normal outline-[#3F8FB7]"/></label>
            <button type="submit" className="flex min-h-14 w-full items-center justify-center bg-[#3F8FB7] px-4 py-4 text-sm font-bold text-white transition-colors hover:bg-[#28789f]">Continuar por WhatsApp <ArrowRight size={17} className="ml-2"/></button>
          </form>
          {submitError && <p role="alert" className="mt-5 border border-red-300 bg-red-50 p-4 text-sm text-red-800">{submitError}</p>}
          <p className="mt-5 text-xs leading-relaxed text-[#776451]">Esta consulta no confirma una reserva. La disponibilidad final debe verificarse con CAICOS.</p>
        </>}
      </div>
    </div>
  </section>;
}
