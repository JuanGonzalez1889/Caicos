import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InnerHero from "@/components/InnerHero";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Quiénes somos | CAICOS Multieventos" };
export default function AboutPage() { return <><SiteHeader/><main>
  <InnerHero title="El valor de cada momento." eyebrow="Quiénes somos" subtitle="Un espacio para encontrarnos, celebrar y crear nuevos recuerdos." image="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=85" compact showAvailability titleClassName="text-[clamp(2.5rem,4vw,4rem)]"/>
  <section aria-labelledby="about-story-title" className="bg-[#F8F6EF] px-6 pt-20 pb-14 sm:px-10 lg:px-16 lg:pt-28 lg:pb-20">
    <Reveal className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
      <p className="text-xs font-bold uppercase tracking-[.25em] text-[#3F8FB7]">Nuestra historia</p>
      <div>
        <h2 id="about-story-title" className="serif-display text-[clamp(2.8rem,5vw,5.5rem)] leading-[1.04] tracking-[-.04em]">Una idea entre amigos.<em className="block text-[#3F8FB7]">Un lugar para compartir.</em></h2>
        <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-[#5A4731]/80">
          <p><strong className="font-semibold text-[#5A4731]">Caicos</strong> nace de un grupo de amigos que comparte una misma idea: celebrar la vida y disfrutar de esos momentos que elegimos compartir.</p>
          <p>De ese deseo nace un espacio pensado para encontrarnos, celebrar y crear nuevos recuerdos.</p>
        </div>
      </div>
    </Reveal>
  </section>
  <section aria-labelledby="about-essence-title" className="bg-[#F8F6EF] px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
    <Reveal className="mx-auto grid max-w-[1400px] gap-8 border-t border-[#5A4731]/20 pt-14 lg:grid-cols-[.7fr_1.3fr] lg:gap-24 lg:pt-20">
      <p className="text-xs font-bold uppercase tracking-[.25em] text-[#3F8FB7]">Nuestra esencia</p>
      <div>
        <h2 id="about-essence-title" className="serif-display text-[clamp(2.8rem,5vw,5.5rem)] leading-[1.04] tracking-[-.04em]">Para nosotros, los más chicos <em className="text-[#3F8FB7]">también son protagonistas.</em></h2>
        <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-[#5A4731]/80">
          <p>Creemos en la importancia de que puedan sentirse valorados, cuidados y respetados, incluso mientras los adultos disfrutan de sus propias celebraciones.</p>
          <p>Por eso, pensamos cada espacio para que todos puedan disfrutar.</p>
        </div>
      </div>
    </Reveal>
  </section>
  </main><SiteFooter/></> }
