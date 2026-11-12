"use client";

import Link from "next/link";
import Image from "next/image";
import HashLink from "./HashLink";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

// Fotografía provisoria. Reemplazarla por /images/hero-caicos.jpg al recibir material real.
const HERO_IMAGE = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=85";
// Para video, crear .env.local con NEXT_PUBLIC_CAICOS_HERO_VIDEO=/videos/caicos-hero.mp4
const HERO_VIDEO = process.env.NEXT_PUBLIC_CAICOS_HERO_VIDEO;
const HERO_POSTER = HERO_VIDEO ? "/images/caicos-hero-poster.jpg" : HERO_IMAGE;

const entry = { hidden: { opacity: 0, y: 35 }, shown: { opacity: 1, y: 0 } };

export default function CinematicHero() {
  return <section id="inicio" className="relative isolate flex min-h-[740px] items-end overflow-hidden bg-[#26211c] text-white sm:min-h-[800px] lg:min-h-[min(920px,100svh)]">
    <motion.div initial={{ opacity: .45, scale: 1.065 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0 -z-20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_POSTER} alt={HERO_VIDEO ? "Vista del salón CAICOS preparado para una celebración" : "Vista de un salón preparado para una celebración (imagen ilustrativa)"} fetchPriority="high" loading="eager" className="h-full w-full object-cover" />
      {HERO_VIDEO && <video autoPlay muted loop playsInline preload="auto" poster={HERO_POSTER} className="absolute inset-0 h-full w-full object-cover" aria-hidden="true"><source src={HERO_VIDEO} type="video/mp4" /></video>}
    </motion.div>
    <div className="photo-dim pointer-events-none absolute inset-0 -z-10" />
    <div className="relative mx-auto w-full max-w-[1500px] px-6 pb-24 pt-40 sm:px-10 lg:px-16 lg:pb-32">
      <motion.div initial="hidden" animate="shown" transition={{ staggerChildren: .15, delayChildren: .25 }} className="max-w-[1050px]">
        <motion.div variants={entry} transition={{ duration: .7 }} className="mb-8 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[.32em] text-[#B5D7E8]"><span className="h-px w-10 bg-[#B5D7E8]" /> CAICOS MULTIEVENTOS</motion.div>
        <motion.h1 variants={entry} transition={{ duration: .9 }} className="serif-display text-[clamp(3.8rem,8.5vw,9.5rem)] leading-[.92] tracking-[-.065em]">Viví el momento.<span className="block italic text-[#C7E1EC]">Nosotros lo hacemos especial.</span></motion.h1>
        <motion.p variants={entry} transition={{ duration: .85 }} className="mt-9 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">Cada celebración es una historia por contar. Descubrí propuestas para hacer de tu próximo evento una experiencia única.</motion.p>
        <motion.div variants={entry} transition={{ duration: .8 }} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/servicios" className="group inline-flex min-h-14 items-center justify-center gap-4 bg-[#3F8FB7] px-7 py-4 text-xs font-bold uppercase tracking-[.12em] text-white transition-colors hover:bg-[#28789f]">Descubrí nuestros servicios <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
          <HashLink href="/#disponibilidad" className="inline-flex min-h-14 items-center justify-center border border-white/70 bg-black/10 px-7 py-4 text-xs font-bold uppercase tracking-[.12em] transition-colors hover:bg-white hover:text-[#32251b]">Consultar una fecha</HashLink>
        </motion.div>
      </motion.div>
    </div>
    <a href="#esencia" className="absolute bottom-7 left-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.24em] text-white/80 sm:left-10 lg:left-16"><span aria-hidden="true" className="hero-scroll-icon inline-flex shrink-0"><Image src="/images/flecha.svg" width={24} height={24} alt="" /></span> Conocé CAICOS</a>
    <span className="absolute bottom-7 right-6 hidden text-[10px] font-semibold uppercase tracking-[.18em] text-white/70 sm:block lg:right-16">Tu evento, nuestra especialidad</span>
  </section>;
}
