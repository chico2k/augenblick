import React from "react";
import NextImage from "next/image";
import imageHero from "/public/hero/bg.png";
// import { Link } from "react-scroll";

const HeroSection: React.FunctionComponent = () => {
  return (
    <section className="relative flex h-screen items-center overflow-hidden">
      <div className="absolute inset-0 z-10 bg-fuchsia-100 opacity-70"></div>
      <NextImage
        alt="Bild von Sandra beim Arbeiten"
        src={imageHero}
        className="absolute inset-0 h-screen object-cover"
      />
      <div className="container  z-40 mx-auto w-full max-w-7xl">
        <div className="sm:comtainer relative z-10 mb-2 pl-5 text-5xl tracking-tight  text-fuchsia-500 sm:text-7xl sm:tracking-normal md:text-9xl">
          Dein
        </div>
        <h1 className="z-20 pl-5 text-5xl tracking-tight text-fuchsia-500  sm:text-7xl sm:tracking-normal md:text-9xl">
          Augenblick
        </h1>

        <div className="mt-3 pl-5 text-lg text-gray-600 sm:text-2xl  lg:text-2xl  ">
          Wimpernverlängerung im Chiemgau
        </div>
        <div className="ml-5 mt-8 flex space-x-2 md:mt-16 lg:space-x-6 lg:text-xl">
          <button
            type="button"
            id="click-buchung"
            className="click-buchung hbover:via-fuchsia-800 inline-flex cursor-pointer items-center rounded-md border 
            border-transparent bg-gradient-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 px-4 py-2 text-xl font-medium text-white shadow-sm transition-all
            duration-300 ease-in-out hover:bg-gradient-to-l hover:from-fuchsia-900
            hover:to-fuchsia-900 focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:ring-offset-2 md:px-6 md:text-2xl"
          >
            Buchung
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
