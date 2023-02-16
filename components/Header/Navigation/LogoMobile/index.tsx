import React from "react";
import NextImage from "next/image";

interface IProps {
  open: boolean;
}

const LogoMobile: React.FC<IProps> = ({ open }) => {
  const isOpen = open ? "hidden" : "";

  return (
    <div
      className={`absolute inset-0 flex justify-center h-full mt-4  z-20
         ${isOpen}
        lg:hidden`}
    >
      <div
        className="h-14 aspect-video relative 
              xs:h-16
              sm:h-24"
      >
        <NextImage
          src="/logo.png"
          alt="Augenblick Logo"
          className="block 
            lg:hidden"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
};

export default LogoMobile;
