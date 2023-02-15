import React from "react";
import NextImage from "next/image";

import lash from "/public/navigation/augenblick.png";

const Augenblick = () => {
  return (
    <div className="container mt-64 max-w-4xl">
      <NextImage
        alt="Strong Lashes"
        src={lash}
        placeholder="blur"
        height={200}
        width={700}
        className="w-full h-full object-contain object-position-bottom "
      />
    </div>
  );
};

export default Augenblick;
