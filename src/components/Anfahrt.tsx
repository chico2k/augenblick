"use client";

import { Element } from "react-scroll";

const AnfahrtSection = () => {
  return (
    <>
      <Element name="anfahrt">
        <div className="mx-auto bg-gradient-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 text-white  md:text-center ">
          <h2 className="font-display px-4 py-16  text-3xl sm:text-4xl lg:text-4xl">
            Hier findest du mich.
          </h2>
        </div>
        <div className="h-screen w-full text-xs">
          <iframe
            title="Anfahrt Augenblick Chiemgau"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10690.83700606855!2d12.6016273!3d47.9420075!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xd66571c4270f68c7!2sAugenblick%20Chiemgau!5e0!3m2!1sen!2sde!4v1640699367324!5m2!1sen!2sde"
            width="100%"
            height="100%"
            className="overflow-hidden "
            loading="lazy"
          />
        </div>
      </Element>
    </>
  );
};

export default AnfahrtSection;
