import LashExtensionVolumen from "../../components/LastExtension-Volumen";
import AngebotSection from "../../components/Angebot";
import SandraComponent from "../../components/Sandra";
import Testimonials from "../../components/Testimonials";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const Newsletter = dynamic(() => import("../../components/Newsletter"), {
  ssr: false,
});

const Slider = dynamic(() => import("../../components/Impressionen"), {
  ssr: false,
});

const AnfahrtSection = dynamic(() => import("../../components/Anfahrt"), {
  ssr: false,
});

const StrongLash = dynamic(() => import("../../components/StrongLash"), {
  ssr: false,
});

const BuchungsSection = dynamic(() => import("../../components/Buchung"), {
  ssr: false,
});

const PartnerSection = dynamic(() => import("../../components/Partner"), {
  ssr: false,
});

const Augenblick = dynamic(() => import("../../components/Augenblick"), {
  ssr: false,
});

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
