import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InnerHero from "@/components/InnerHero";
import ExperienceBands from "@/components/ExperienceBands";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

export const metadata = { title: "Servicios | CAICOS Multieventos" };
const showServicesHero = false;

export default function ServicesPage() {
  return <><SiteHeader/><main>{showServicesHero && <InnerHero title="Experiencias para celebrar." eyebrow="Nuestros servicios" subtitle="Explorá nuestras tres categorías y encontrá la propuesta ideal para tu próximo evento." image="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2200&q=85"/>}<ExperienceBands layout="cards"/><AvailabilityCalendar/></main><SiteFooter/></>;
}
