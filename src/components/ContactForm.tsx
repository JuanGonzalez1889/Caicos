"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.trim().length < 2 || !contact.trim() || !message.trim()) {
      setSubmitError("Completá tu nombre, un teléfono o email y el mensaje para continuar.");
      return;
    }
    setSubmitError("");
    const text = `¡Hola! Quisiera comunicarme con CAICOS MULTIEVENTOS.\nNombre: ${name.trim()}\nTeléfono o email: ${contact.trim()}\nServicio: ${service || "A definir"}\nMensaje: ${message.trim()}`;
    window.open(`https://wa.me/5493476596260?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }
  return <div className={`bg-[#F8F6EF] text-[#5A4731] ${compact ? "rounded-xl p-5 shadow-xl sm:p-6" : "p-6 sm:p-10"}`}>
    <p className={`${compact ? "mb-5" : "mb-8"} text-xs font-bold uppercase tracking-[.2em] text-[#3F8FB7]`}>Escribinos</p>
    <form onSubmit={submit} className={compact ? "space-y-4 [&_input]:py-2 [&_select]:py-2 [&_textarea]:py-2" : "space-y-6"}>
      <label className="block text-sm font-semibold">Nombre y apellido<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} className="mt-2 block w-full border-b border-[#A89982] bg-transparent px-1 py-3 outline-[#3F8FB7]" /></label>
      <label className="block text-sm font-semibold">Teléfono o email<input required value={contact} onChange={e=>setContact(e.target.value)} className="mt-2 block w-full border-b border-[#A89982] bg-transparent px-1 py-3 outline-[#3F8FB7]" /></label>
      <label className="block text-sm font-semibold">Servicio de interés<select value={service} onChange={e=>setService(e.target.value)} className="mt-2 block w-full border-b border-[#A89982] bg-transparent px-1 py-3 outline-[#3F8FB7]"><option value="">A definir</option>{services.map(s=><option key={s.slug} value={s.name}>{s.name}</option>)}</select></label>
      <label className="block text-sm font-semibold">Contanos un poco más<textarea required value={message} onChange={e=>setMessage(e.target.value)} rows={compact ? 3 : 4} className="mt-2 block w-full border-b border-[#A89982] bg-transparent px-1 py-3 outline-[#3F8FB7]" /></label>
      {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
      <button type="submit" className={`inline-flex min-h-14 items-center justify-center gap-4 bg-[#3F8FB7] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-[#28789f] ${compact ? "w-full" : ""}`}>Continuar por WhatsApp <ArrowUpRight size={19}/></button>
    </form>
  </div>;
}
