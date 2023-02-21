import React from "react";
import NextImage from "next/image";
import lash from "/public/stronglash/quote.png";

const StrongLash = () => {
  return (
    <div className="container py-2 pb-40 overflow-hidden ">
      <NextImage
        alt="Zitat 'May your coffee be strong and your lashes be long'"
        src={lash}
        placeholder="blur"
        className=" object-contain object-position-bottom scale-125 md:scale-100 md:h-[700px] "
      />
    </div>
  );
};

export default StrongLash;
