import Head from "next/head";
import React from "react";
import Impressum from "../components/Impressum";

const ImpressumPage = () => {
  return (
    <>
      <Head>
        <title>Impressum - Augenblick Chiemgau</title>
        <meta
          name="description"
          content="Augenblick Chiemgau - Wimperverlängerung Lashlift Traunreut Impressum"
        />
      </Head>
      <Impressum />
    </>
  );
};

export default ImpressumPage;
