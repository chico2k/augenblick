import React from "react";
import LashExtension1zu1 from "../components/LastExtension-1zu1";
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
const LashExtension1zu1Page = () => {
  return (
    <>
      <Head>
        <title>Augenblick Chiemgau</title>
        <meta
          name="description"
          content="Augenblick Chiemgau - Lashextension 1 zu 1 Technik"
        />
      </Head>
      <LashExtension1zu1 />;
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

export default LashExtension1zu1Page;
