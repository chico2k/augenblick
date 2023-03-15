import React from "react";
import NextImage from "next/image";
import lash from "/public/navigation/augenblick.png";

const Augenblick = () => {
  return (
    <div className="mx-auto my-36 max-w-4xl px-8 md:my-32 md:px-12 lg:my-44">
      <NextImage
        alt="Strong Lashes"
        src={lash}
        placeholder="blur"
        className="object-position-bottom h-full w-full object-contain "
      />
    </div>
  );
};

export default Augenblick;
