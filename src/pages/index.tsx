import type { NextPage } from "next";
import AnfahrtSection from "../components/Anfahrt";
import BuchungsSection from "../components/Buchung";
import PartnerSection from "../components/Partner";
import AngebotSection from "../components/Angebot";
import SandraComponent from "../components/Sandra";
import Slider from "../components/Impressionen";
import HeroSection from "../components/Hero";
import Testimonials from "../components/Testimonials";
import StrongLash from "../components/StrongLash";
import Augenblick from "../components/Augenblick";
import Newsletter from "../components/Newsletter";

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
