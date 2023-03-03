import Head from "next/head";
import React from "react";
import DateschutzComponent from "../components/Datenschutz";

const DatenSchutzPage = () => {
  return (
    <>
      <Head>
        <title>Datenschutz - Augenblick Chiemgau</title>
      </Head>
      <DateschutzComponent />;
    </>
  );
};

export default DatenSchutzPage;
