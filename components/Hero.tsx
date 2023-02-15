import React from "react";
import NextImage from "next/image";

import imageHero from "/public/IMG_0106_test.png";
import { Link } from "react-scroll";

const HeroSection: React.FunctionComponent = () => {
  return (
    <section className="flex items-center h-screen relative overflow-hidden">
      <div className="bg-white opacity-70 z-10 absolute inset-0"></div>
      <NextImage
        alt="Bild von Sandra beim Arbeiten"
        src={imageHero}
        className="object-cover absolute inset-0 h-screen"
      />
      <div className="w-full max-w-7xl mx-auto container z-40">
        <div className="relative pl-5  text-fuchsia-500 text-5xl tracking-tight z-10 xs:text-6xl sm:tracking-normal sm:text-7xl sm:comtainer md:text-9xl">
          Dein
        </div>
        <h1 className="pl-5  text-fuchsia-500 text-5xl tracking-tight z-20 xs:text-6xl sm:tracking-normal sm:text-7xl md:text-9xl">
          Augenblick
        </h1>

        <div
          className="mt-3 text-lg pl-5 sm:text-2xl lg:text-2xl  text-gray-600 tracking-wider
        "
        >
          Wimpernverlängerung im Chiemgau
        </div>
        <div className="ml-5 mt-24 space-x-2 flex lg:text-xl lg:space-x-6">
          <button
            type="button"
            id="click-buchung"
            className="click-buchung inline-flex items-center rounded-md border border-transparent cursor-pointer bg-fuchsia-500 px-6 py-2 text-2xl font-medium text-white shadow-sm hover:bg-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Buchung
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
