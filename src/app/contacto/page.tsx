import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contacto | CAICOS Multieventos" };
export default function ContactPage() { return <><SiteHeader/><main className="bg-[#EADCC4]/40 px-6 pb-24 pt-40 sm:px-10 lg:px-16 lg:pb-36 lg:pt-52"><div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1fr_.9fr] lg:gap-20"><div><p className="text-xs font-bold uppercase tracking-[.3em] text-[#3F8FB7]">Hablemos</p><h1 className="serif-display mt-7 text-[clamp(4rem,7.5vw,9rem)] leading-[.95] tracking-[-.055em]">Tu próximo evento<br/><em className="text-[#3F8FB7]">empieza acá.</em></h1><p className="mt-9 max-w-lg text-lg leading-relaxed text-[#5A4731]/80">Contanos qué estás imaginando y demos el primer paso. Podés consultar fechas desde la Home o enviarnos un mensaje desde este formulario.</p><p className="mt-10 max-w-sm border-t border-[#5A4731]/20 pt-6 text-sm text-[#776451]">Los datos comerciales y las redes sociales se incorporarán cuando CAICOS los confirme.</p></div><ContactForm/></div></main><SiteFooter/></> }
