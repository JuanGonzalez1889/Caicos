import Image from "next/image";
import Link from "next/link";
import HashLink from "./HashLink";

export default function SiteFooter() {
  return <footer className="bg-[#211c18] px-6 pb-10 pt-20 text-[#F8F6EF] sm:px-10 lg:px-16">
    <div className="mx-auto grid max-w-[1400px] gap-12 border-b border-white/20 pb-16 lg:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <span className="inline-flex  px-4 py-2"><Image alt="CAICOS Multieventos" src="/images/caicos-logo.png" width={1454} height={825} className="h-auto w-36" /></span>
        <p className="mt-7 max-w-sm text-xl text-white/75">Tu evento, nuestra especialidad.</p>
      </div>
      <div className="space-y-4 text-sm"><p className="text-xs uppercase tracking-[.3em] text-[#9CC3D8]">Explorar</p><p><Link href="/">Inicio</Link></p><p><Link href="/servicios">Servicios</Link></p><p><Link href="/quienes-somos">Quiénes somos</Link></p><p><Link href="/contacto">Contacto</Link></p></div>
      <div className="space-y-4 text-sm"><p className="text-xs uppercase tracking-[.3em] text-[#9CC3D8]">Hablemos</p><a href="https://wa.me/5493476596260" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de CAICOS: 3476 596260 (abre en una nueva pestaña)" className="inline-flex min-h-11 items-center gap-3 transition-colors hover:text-[#9CC3D8]"><Image src="/images/wsp.svg" width={26} height={26} alt="" className="shrink-0" /><span>Whatsapp</span></a><p><HashLink href="/#disponibilidad" className="underline underline-offset-4">Consultar disponibilidad</HashLink></p></div>
    </div>
    <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-2 pt-7 text-xs text-white/55 sm:flex-row"><span>© CAICOS MULTIEVENTOS</span><span></span></div>
  </footer>;
}
