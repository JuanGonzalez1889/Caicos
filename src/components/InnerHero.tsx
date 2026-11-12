import HashLink from "./HashLink";
import { ArrowUpRight } from "lucide-react";
import ServiceBackButton from "./ServiceBackButton";
export default function InnerHero({ title, subtitle, eyebrow, image, compact = false, showBack = false, titleClassName, showAvailability = !compact }: { title: string; subtitle: string; eyebrow: string; image: string; compact?: boolean; showBack?: boolean; titleClassName?: string; showAvailability?: boolean }) {
  return <section className={`relative isolate flex items-end overflow-hidden bg-[#211c18] px-6 text-white sm:px-10 lg:px-16 ${compact ? "min-h-[360px] pb-12 pt-32 sm:min-h-[390px] lg:min-h-[420px]" : "min-h-[500px] pb-20 pt-40 lg:min-h-[620px]"}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}<img src={image} alt="Imagen de ambientación ilustrativa" className="absolute inset-0 -z-20 h-full w-full object-cover"/>
    <div className="photo-dim absolute inset-0 -z-10" />
    <div className="mx-auto w-full max-w-[1400px]">
      {showBack && <ServiceBackButton />}
      <p className={`text-xs font-bold uppercase tracking-[.3em] text-[#C7E1EC] ${compact ? "mb-4" : "mb-6"}`}>{eyebrow}</p><h1 className={`serif-display max-w-[1000px] leading-[.92] tracking-[-.05em] ${titleClassName ?? (compact ? "text-[clamp(3.2rem,6vw,6rem)]" : "text-[clamp(3.8rem,8vw,9rem)]")}`}>{title}</h1><p className={`${compact ? "mt-5" : "mt-8"} max-w-xl text-lg text-white/85`}>{subtitle}</p>{showAvailability && <HashLink href="/#disponibilidad" className="mt-8 inline-flex items-center gap-3 border-b border-white pb-2 text-xs font-bold uppercase tracking-widest">Consultar una fecha <ArrowUpRight size={17}/></HashLink>}</div>
  </section>;
}
