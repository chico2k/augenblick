import LashExtensionVolumen from "@/components/LastExtension-Volumen";
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
  title: "Augenblick Chiemgau - Lashextension Volumentechnik",
  description: "Augenblick Chiemgau - Lashextension Volumentechnik",
};

export default function LashExtensionVolumenPage() {
  return (
    <section className="relative font-sans">
      <LashExtensionVolumen />
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
