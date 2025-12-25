import LashExtension1zu1 from "../../components/LastExtension-1zu1";
import AngebotSection from "../../components/Angebot";
import SandraComponent from "../../components/Sandra";
import Testimonials from "../../components/Testimonials";
import Newsletter from "../../components/Newsletter";
import Slider from "../../components/Impressionen";
import AnfahrtSection from "../../components/Anfahrt";
import StrongLash from "../../components/StrongLash";
import BuchungsSection from "../../components/Buchung";
import PartnerSection from "../../components/Partner";
import Augenblick from "../../components/Augenblick";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Augenblick Chiemgau - Lashextension 1 zu 1 Technik",
  description: "Augenblick Chiemgau - Lashextension 1 zu 1 Technik",
};

export default function LashExtension1zu1Page() {
  return (
    <section className="relative font-sans">
      <LashExtension1zu1 />
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
