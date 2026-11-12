import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InnerHero from "@/components/InnerHero";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import ServiceGallery from "@/components/ServiceGallery";
import { findService, services } from "@/data/services";
import { notFound } from "next/navigation";

export function generateStaticParams() { return services.map(s => ({ slug: s.slug })); }
export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();
  return <><SiteHeader/><main>
    <InnerHero title={service.name} eyebrow={service.eyebrow} subtitle={service.short} image={service.image} compact showBack/>
    <ServiceGallery serviceName={service.name} description={service.description} photos={service.gallery} illustrative={service.galleryIsIllustrative}/>
    <AvailabilityCalendar initialService={service.slug} compactSpacing/>
  </main><SiteFooter/></>;
}
