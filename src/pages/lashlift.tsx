import React from "react";
import LastLift from "../components/LastLift";
import AngebotSection from "../components/Angebot";
import SandraComponent from "../components/Sandra";
import Testimonials from "../components/Testimonials";
import dynamic from "next/dynamic";
import Head from "next/head";

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

const LasliftPage = () => {
  return (
    <>
      <Head>
        <title>Augenblick Chiemgau</title>
        <meta name="description" content="Augenblick Chiemgau - Lashlift" />
      </Head>
      <LastLift />;
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
    </>
  );
};

export default LasliftPage;
