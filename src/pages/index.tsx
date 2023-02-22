import type { NextPage } from "next";
import AngebotSection from "../components/Angebot";
import SandraComponent from "../components/Sandra";
import HeroSection from "../components/Hero";
import Testimonials from "../components/Testimonials";
import dynamic from "next/dynamic";

const Newsletter = dynamic(() => import("../components/Newsletter"), {
  ssr: false,
});

const Slider = dynamic(() => import("../components/Impressionen"), {
  ssr: false,
});

const AnfahrtSection = dynamic(() => import("../components/Anfahrt"), {
  ssr: false,
});

const StrongLash = dynamic(() => import("../components/StrongLash"), {
  ssr: false,
});
const BuchungsSection = dynamic(() => import("../components/Buchung"), {
  ssr: false,
});
const PartnerSection = dynamic(() => import("../components/Partner"), {
  ssr: false,
});

const Augenblick = dynamic(() => import("../components/Augenblick"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className="relative font-sans">
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
    </div>
  );
};

export default Home;
