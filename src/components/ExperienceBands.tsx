import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import Reveal from "./Reveal";

export default function ExperienceBands({ compact = false, layout = "bands" }: { compact?: boolean; layout?: "bands" | "cards" }) {
  const cards = layout === "cards";

  return <section id="experiencias" className="bg-[#EADCC4]/45 py-20 lg:py-28">
    <div className="mx-auto max-w-[1400px] px-6 pb-12 sm:px-10 lg:px-16">
      <Reveal><p className="text-[11px] font-bold uppercase tracking-[.3em] text-[#3F8FB7]">02 / Experiencias</p>
      <div className="mt-6 flex flex-col gap-6"><h2 className="serif-display text-[clamp(3.2rem,6vw,7rem)] leading-none tracking-[-.04em]">Cada ocasión,<br /><em className="text-[#3F8FB7]">su propia historia.</em></h2><p className="max-w-lg text-lg leading-relaxed text-[#5A4731]/75">Eventos Infantiles, eventos sociales y eventos empresariales. Tres maneras de empezar a imaginar tu evento.</p></div></Reveal>
    </div>
    <div className={cards ? "mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-3 lg:gap-6 lg:px-16" : "space-y-2"}>
      {services.map((service, idx) => <Reveal key={service.slug}>
        <Link href={`/servicios/${service.slug}`} className={`group relative block overflow-hidden bg-[#29231d] ${cards ? "aspect-[4/3]" : "min-h-[360px] sm:min-h-[440px] lg:min-h-[520px]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.image} alt={`Referencia visual de ${service.name}`} loading="lazy" className="image-zoom absolute inset-0 h-full w-full object-cover" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(25,21,16,0.95)_0%,rgba(25,21,16,0.65)_45%,rgba(25,21,16,0.08)_100%),linear-gradient(90deg,rgba(25,21,16,0.65)_0%,transparent_80%)]" />
          <div className={`flex flex-col justify-end text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] ${cards ? "absolute inset-0 p-6 sm:p-7" : "relative mx-auto min-h-[360px] max-w-[1400px] px-6 pb-12 sm:min-h-[440px] sm:px-10 lg:min-h-[520px] lg:px-16 lg:pb-16"}`}>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.3em] text-[#C7E1EC]">0{idx + 1} / {service.name}</p>
            <div className="flex items-end justify-between gap-5">
              <div><h3 className={`serif-display leading-none tracking-[-.04em] ${cards ? "text-4xl sm:text-5xl" : "text-[clamp(3.2rem,6.5vw,7.4rem)]"}`}>{service.name}</h3><p className={`mt-3 max-w-lg text-white/85 ${cards ? "text-sm" : "text-sm sm:mt-4 sm:text-lg"}`}>{service.short}</p></div>
              <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full border border-white/80 transition-all group-hover:bg-[#3F8FB7] ${cards ? "size-11" : "size-12 sm:size-16"}`}><ArrowUpRight size={cards ? 20 : 25}/></span>
            </div>
          </div>
        </Link>
      </Reveal>)}
    </div>
    {compact && <div className="mt-12 px-6 text-center"><Link href="/servicios" className="inline-flex items-center gap-3 border-b border-[#5A4731] pb-2 text-xs font-bold uppercase tracking-[.17em]">Ver todos los servicios <ArrowUpRight size={17}/></Link></div>}
  </section>;
}
