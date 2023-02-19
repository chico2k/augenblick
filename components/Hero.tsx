import React from "react";
import NextImage from "next/image";

import imageHero from "/public/hero/bg.png";
import { Link } from "react-scroll";

const HeroSection: React.FunctionComponent = () => {
  return (
    <section className="flex items-center h-screen relative overflow-hidden">
      <div className="bg-fuchsia-100 opacity-70 z-10 absolute inset-0"></div>
      <NextImage
        priority={true}
        alt="Bild von Sandra beim Arbeiten"
        src={imageHero}
        className="object-cover absolute inset-0 h-screen"
      />
      <div className="w-full max-w-7xl mx-auto container z-40">
        <div className="relative pl-5  text-fuchsia-500 text-5xl tracking-tight z-10  sm:tracking-normal sm:text-7xl sm:comtainer md:text-9xl">
          Dein
        </div>
        <h1 className="pl-5 text-fuchsia-500 text-5xl tracking-tight z-20  sm:tracking-normal sm:text-7xl md:text-9xl">
          Augenblick
        </h1>

        <div className="mt-3 text-lg pl-5 sm:text-2xl lg:text-2xl  text-gray-600  ">
          Wimpernverlängerung im Chiemgau
        </div>
        <div className="ml-5 mt-8 md:mt-24 space-x-2 flex lg:text-xl lg:space-x-6">
          <button
            type="button"
            id="click-buchung"
            className="click-buchung inline-flex items-center rounded-md border border-transparent cursor-pointer 
            bg-gradient-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 px-4 md:px-6 py-2 text-xl md:text-2xl font-medium text-white shadow-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            hover:bg-gradient-to-l hover:from-fuchsia-900 hbover:via-fuchsia-800 hover:to-fuchsia-900  transition-all duration-300 ease-in-out"
          >
            Buchung
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
