import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InnerHero from "@/components/InnerHero";
import ClosingStatement from "@/components/ClosingStatement";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Quiénes somos | CAICOS Multieventos" };
export default function AboutPage() { return <><SiteHeader/><main>
  <InnerHero title="El valor de cada momento." eyebrow="Quiénes somos" subtitle="Una marca dedicada a acompañar celebraciones y experiencias especiales." image="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=85"/>
  <section className="bg-[#F8F6EF] px-6 py-24 sm:px-10 lg:px-16 lg:py-36"><Reveal className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#3F8FB7]">Nuestra esencia</p><div><h2 className="serif-display text-[clamp(3rem,5.7vw,7rem)] leading-[1.04] tracking-[-.04em]">Creemos que los detalles <em className="text-[#3F8FB7]">hacen la diferencia.</em></h2><p className="mt-10 max-w-2xl text-lg leading-relaxed text-[#5A4731]/80">CAICOS Multieventos reúne propuestas para distintas clases de celebraciones, con una mirada puesta en la experiencia de cada persona. Esta página se completará con la historia real, el equipo y los valores de la empresa.</p></div></Reveal></section>
  <ClosingStatement/>
  </main><SiteFooter/></> }
