import Image from "next/image";
import { ArrowUpRight, Clock, MapPin, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";

const MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d363.0326720006023!2d-60.735216275586986!3d-32.75389390467421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65b97d2789557%3A0xc67aef6376836188!2sCaicos%20Multieventos!5e0!3m2!1ses!2sar!4v1794500634427!5m2!1ses!2sar";
const MAP_DIRECTIONS = "https://www.google.com/maps/dir/?api=1&destination=Caicos%20Multieventos%2C%20Gral.%20L%C3%B3pez%20760%2C%20San%20Lorenzo%2C%20Santa%20Fe%2C%20Argentina";

export default function ClosingStatement() {
  return (
    <section
      id="ubicacion"
      aria-labelledby="ubicacion-title"
      className="relative scroll-mt-24 bg-[#9CC3D8] px-6 py-20 text-[#5A4731] sm:px-10 lg:px-16 lg:py-28"
    >
      <a href="#ubicacion" aria-label="Conocé nuestra ubicación" className="absolute left-1/2 top-0 z-10 inline-flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3F8FB7]">
        <span className="hero-scroll-icon inline-flex" aria-hidden="true"><Image src="/images/flecha.svg" width={36} height={36} alt="" /></span>
      </a>
      <Reveal className="mx-auto grid max-w-[1400px] overflow-hidden rounded-2xl border border-[#5A4731]/10 bg-white shadow-[0_16px_48px_-20px_rgba(90,71,49,0.25)] lg:grid-cols-[1.1fr_1fr]">
        <iframe
          src={MAP_EMBED}
          title="Ubicación de CAICOS Multieventos en Google Maps"
          width="600"
          height="450"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-[320px] w-full border-0 sm:h-[400px] lg:h-full lg:min-h-[450px]"
        />
        <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-12">
          <p className="mb-5 text-xs font-bold uppercase tracking-[.3em] text-[#3F8FB7]">
            04 / Vení a conocernos
          </p>
          <h2
            id="ubicacion-title"
            className="serif-display text-[clamp(2.5rem,4vw,4.5rem)] leading-[1.05] tracking-[-.04em]"
          >
            Nuestra <em className="text-[#3F8FB7]">ubicación.</em>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[#5A4731]/80">
            Encontrá CAICOS Multieventos en el mapa y consultá cómo llegar para
            empezar a imaginar tu próximo evento.
          </p>
          <div className="mt-8 space-y-6 border-t border-[#5A4731]/15 pt-6">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#3F8FB7]/10 text-[#3F8FB7]">
                <MapPin aria-hidden="true" size={21} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Dirección</p>
                <p className="mt-1 text-sm leading-relaxed text-[#5A4731]/80">
                  Gral. López 760
                  <br />
                  San Lorenzo, Santa Fe, Argentina
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#3F8FB7]/10 text-[#3F8FB7]">
                <Clock aria-hidden="true" size={21} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Horarios de atención</p>
                <p className="mt-1 text-sm leading-relaxed text-[#5A4731]/80">
                  Lunes a viernes de 8:00 a 16:00
                  <br />
                  Para reservaciones
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#3F8FB7]/10 text-[#3F8FB7]">
                <MessageCircle aria-hidden="true" size={21} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Contacto directo</p>
                <a
                  href="https://wa.me/5493476596260"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex min-h-11 items-center gap-2 text-sm text-[#5A4731]/80 hover:text-[#3F8FB7]"
                >
                  <Image
                    src="/images/wsp.svg"
                    width={24}
                    height={24}
                    alt=""
                    className="shrink-0"
                  />
                  <span>WhatsApp: 3476 596260</span>
                  <span className="sr-only"> (abre en una nueva pestaña)</span>
                </a>
                <a
                  href="mailto:caicos.eventos@gmail.com"
                  className="flex min-h-11 items-center gap-2 text-sm text-[#5A4731]/80 hover:text-[#3F8FB7]"
                >
                  <Image
                    src="/images/mail.svg"
                    width={24}
                    height={24}
                    alt=""
                    className="shrink-0"
                  />
                  <span className="break-all">caicos.eventos@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
          <a
            href={MAP_DIRECTIONS}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 bg-[#3F8FB7] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[#28789f]"
          >
            Cómo llegar <ArrowUpRight aria-hidden="true" size={19} />
            <span className="sr-only">
              {" "}
              (abre Google Maps en una nueva pestaña)
            </span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
