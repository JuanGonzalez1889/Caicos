"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HashLink from "./HashLink";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/contacto", label: "Contacto" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 45);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b [font-family:var(--font-montserrat),sans-serif] transition-[background-color,border-color,box-shadow] duration-500 ${
      overHero ? "border-white/15 bg-[#201a15]/35 text-white backdrop-blur-sm" : "border-[#5A4731]/10 bg-[#F8F6EF]/96 text-[#5A4731] shadow-sm backdrop-blur-xl"
    }`}>
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-5 px-5 sm:px-9 lg:h-24 lg:px-14">
        <Link href="/" className="flex shrink-0 items-center rounded-sm px-3 py-1.5" aria-label="CAICOS - Inicio">
          <Image src="/images/caicos-logo.png" width={1454} height={825} alt="CAICOS Multieventos" priority className="h-auto w-[108px] sm:w-[135px]" />
        </Link>
        <nav aria-label="Navegación principal" className="hidden items-center gap-8 lg:flex xl:gap-11">
          {links.map(({ href, label }) => <Link key={href} href={href} className={`text-sm font-semibold uppercase tracking-[.15em] transition-colors hover:text-[#9CC3D8] ${pathname === href ? "text-[#9CC3D8]" : ""}`}>{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <a href="https://www.instagram.com/caicos.eventos/" target="_blank" rel="noreferrer" aria-label="Instagram de CAICOS" className="transition-transform hover:scale-110">
            <Image src="/images/insta.svg" width={30} height={30} alt="" />
          </a>
          <Link href={process.env.NEXT_PUBLIC_CAICOS_WHATSAPP ? `https://wa.me/${process.env.NEXT_PUBLIC_CAICOS_WHATSAPP.replace(/\D/g, "")}` : "/contacto"} target={process.env.NEXT_PUBLIC_CAICOS_WHATSAPP ? "_blank" : undefined} rel={process.env.NEXT_PUBLIC_CAICOS_WHATSAPP ? "noreferrer" : undefined} aria-label="WhatsApp de CAICOS" className="transition-transform hover:scale-110">
            <Image src="/images/wsp.svg" width={30} height={30} alt="" />
          </Link>
        </div>
        <button type="button" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="caicos-mobile-menu" className="inline-flex items-center justify-center p-3 lg:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && <motion.nav id="caicos-mobile-menu" aria-label="Menú móvil" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} className="overflow-hidden border-t border-[#5A4731]/15 bg-[#F8F6EF] text-[#5A4731] lg:hidden">
          <div className="flex flex-col px-6 py-5">
            {links.map(({ href, label }) => <Link href={href} key={href} onClick={() => setOpen(false)} className="border-b border-[#5A4731]/15 py-4 text-xl">{label}</Link>)}
            <HashLink href="/#disponibilidad" onClick={() => setOpen(false)} className="mt-6 bg-[#3F8FB7] px-5 py-4 text-center text-sm font-bold text-white">Consultar disponibilidad</HashLink>
          </div>
        </motion.nav>}
      </AnimatePresence>
    </header>
  );
}
