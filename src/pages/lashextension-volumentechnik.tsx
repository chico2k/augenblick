import React from "react";
import LashExtensionVolumen from "../components/LastExtension-Volumen";
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

const LashExtensionVolumenPage = () => {
  return (
    <>
      <Head>
        <title>Augenblick Chiemgau - Lashextension Volumentechnik</title>
        <meta
          name="description"
          content="Augenblick Chiemgau - Lashextension Volumentechnik"
        />
      </Head>
      <LashExtensionVolumen />;
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

export default LashExtensionVolumenPage;
