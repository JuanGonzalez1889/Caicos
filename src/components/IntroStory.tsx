import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const DETAIL_IMAGE =
  "/images/inicio2.png";

export default function IntroStory() {
  return <section id="esencia" className="relative scroll-mt-24 bg-[#F8F6EF] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
    <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-24">
      <Reveal>
        <p className="mb-8 text-[11px] font-bold uppercase tracking-[.3em] text-[#3F8FB7]">01 / Nuestra esencia</p>
        <h2 className="serif-display max-w-[820px] text-[clamp(3rem,5.5vw,6.5rem)] leading-[1.05] tracking-[-.045em] text-[#5A4731]">No se trata solo de organizar un evento.<span className="block italic text-[#3F8FB7]">Se trata de vivirlo.</span></h2>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-[#5A4731]/80 sm:text-lg">En CAICOS Multieventos nos enfocamos en los detalles que convierten una celebración en una experiencia personal. Acompañamos distintas ocasiones con propuestas pensadas para cada momento.</p>
        <Link href="/quienes-somos" className="group mt-9 inline-flex items-center gap-3 border-b border-[#5A4731] pb-2 text-xs font-bold uppercase tracking-[.15em] text-[#5A4731] hover:text-[#3F8FB7]">Conocé nuestra esencia <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1"/></Link>
      </Reveal>
      <Reveal className="relative">
        <div className="aspect-square overflow-hidden rounded-xl border border-[#5A4731]/15 bg-[#EADCC4] p-2 shadow-[0_16px_40px_-12px_rgba(90,71,49,0.28)] transition-[transform,box-shadow] duration-500 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_24px_50px_-12px_rgba(90,71,49,0.35)] motion-reduce:transition-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DETAIL_IMAGE} alt="Detalles de una celebración (imagen ilustrativa)" loading="lazy" className="h-full w-full rounded-md object-contain" />
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-[.17em] text-[#5A4731]/65">Detalles que hacen único cada encuentro</p>
      </Reveal>
    </div>
    <a href="#experiencias" aria-label="Descubrí nuestras experiencias" className="absolute bottom-0 left-1/2 z-10 inline-flex size-12 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3F8FB7]">
      <span className="hero-scroll-icon inline-flex" aria-hidden="true"><Image src="/images/flecha.svg" width={36} height={36} alt="" /></span>
    </a>
  </section>;
}
