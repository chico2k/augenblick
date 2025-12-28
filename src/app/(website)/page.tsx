import AngebotSection from "@/components/Angebot";
import SandraComponent from "@/components/Sandra";
import HeroSection from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Slider from "@/components/Impressionen";
import AnfahrtSection from "@/components/Anfahrt";
import StrongLash from "@/components/StrongLash";
import BuchungsSection from "@/components/Buchung";
import PartnerSection from "@/components/Partner";
import Augenblick from "@/components/Augenblick";

export default function HomePage() {
  return (
    <section className="relative font-sans">
      <HeroSection />
      <SandraComponent />
      <AngebotSection />
      <Slider />
      <Testimonials />
      <Newsletter />
      <Augenblick />
      <BuchungsSection />
      <PartnerSection />
      <StrongLash />
      <AnfahrtSection />
    </section>
  );
}
