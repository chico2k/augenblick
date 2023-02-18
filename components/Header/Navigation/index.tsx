import { Disclosure } from "@headlessui/react";
import MenuMobil from "./MenuMobil";
import MenuDesk from "./MenuDesk";
import LogoMobile from "./LogoMobile";

const Navigation = () => {
  return (
    <header className="absolute inset-x-0 z-50">
      <Disclosure as="nav" className="mb-2 max-w-7xl mx-auto">
        {({ open }) => {
          return (
            <>
              <div
                className="mx-auto mt-4 pl-5
                sm:container sm:mt-10"
              >
                <div className="flex justify-between">
                  <MobileMenuButton open={open} />
                  <LogoMobile open={open} />
                  <MenuDesk />
                </div>
                <MenuMobil open={open} />
              </div>
            </>
          );
        }}
      </Disclosure>
    </header>
  );
};

export default Navigation;

import React from "react";

import { MenuIcon, XIcon } from "@heroicons/react/outline";

interface IProps {
  open: boolean;
}

const MobileMenuButton: React.FC<IProps> = ({ open }) => {
  return (
    <Disclosure.Button
      className="inline-flex items-center  rounded-md text-fuchsia-500  z-40
        hover:text-fuchsia-600 hover:bg-gray-100 
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500
        lg:hidden
          "
    >
      <span className="sr-only">Open main menu</span>
      {open ? (
        <XIcon className="block h-12 w-12 md:h-14 md:w-14" aria-hidden="true" />
      ) : (
        <MenuIcon
          className="block h-12 w-12 md:h-14 md:w-14"
          aria-hidden="true"
        />
      )}
    </Disclosure.Button>
  );
};
