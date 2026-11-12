import SiteHeader from "@/components/SiteHeader";
import CinematicHero from "@/components/CinematicHero";
import IntroStory from "@/components/IntroStory";
import ExperienceBands from "@/components/ExperienceBands";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import ClosingStatement from "@/components/ClosingStatement";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return <><SiteHeader/><main><CinematicHero/><IntroStory/><ExperienceBands compact/><AvailabilityCalendar/><ClosingStatement/></main><SiteFooter/></>;
}
