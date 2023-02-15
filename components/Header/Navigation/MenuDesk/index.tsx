import React, { useEffect, useState } from "react";
import { navigationLinks } from "../links";
import NextImage from "next/image";
import { Link } from "react-scroll";

const MenuDesk = () => {
  const links = navigationLinks.map((link) => {
    return (
      <div key={link.name}>
        <Link to={link.href} spy={true} smooth={true} duration={500}>
          <span className="cursor-pointer border-transparent text-gray-500 px-1 pt-2 text-sm  block uppercase hover:text-fuchsia-500 lg:text-sm lg:tracking-tight xl:text-base 2xl:text-lg">
            {link.name}
          </span>
        </Link>
      </div>
    );
  });

  return (
    <div
      className={`flex-1 flex  container    lg:items-stretch md:justify-start`}
    >
      <div className="hidden lg:block    relative">
        <NextImage
          src="/navigation/augenblick.png"
          alt="Augenblick Logo"
          className="hidden lg:block"
          width={200}
          height={200}
        />
      </div>
      <div className="hidden lg:ml-6 lg:flex lg:space-x-2  justify-center items-center">
        {links}
      </div>
    </div>
  );
};

export default MenuDesk;
