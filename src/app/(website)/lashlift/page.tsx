import LastLift from "@/components/LastLift";
import AngebotSection from "@/components/Angebot";
import SandraComponent from "@/components/Sandra";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Slider from "@/components/Impressionen";
import AnfahrtSection from "@/components/Anfahrt";
import StrongLash from "@/components/StrongLash";
import BuchungsSection from "@/components/Buchung";
import PartnerSection from "@/components/Partner";
import Augenblick from "@/components/Augenblick";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Augenblick Chiemgau - Lashlift",
  description: "Augenblick Chiemgau - Lashlift",
};

export default function LashliftPage() {
  return (
    <section className="relative font-sans">
      <LastLift />
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
