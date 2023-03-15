import React from "react";
import NextImage from "next/image";
import lash from "/public/stronglash/quote.png";

const StrongLash = () => {
  return (
    <div className="mx-auto max-w-7xl overflow-hidden py-2 pb-40 lg:pt-20 ">
      <NextImage
        alt="Zitat 'May your coffee be strong and your lashes be long'"
        src={lash}
        placeholder="blur"
        className=" object-position-bottom scale-125 object-contain md:h-[700px] md:scale-100 "
      />
    </div>
  );
};

export default StrongLash;
