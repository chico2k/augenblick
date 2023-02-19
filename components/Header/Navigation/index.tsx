import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import React from "react";
import NextImage from "next/image";
import { Link } from "react-scroll";
import { navigationLinks } from "./links";
import logo from "public//navigation/augenblick.png";
import { useSpring, animated } from "react-spring";

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
                  <Disclosure.Button className="inline-flex items-center  rounded-md text-fuchsia-500  z-40        hover:text-fuchsia-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden ">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon
                        className="block h-10 w-10 mt-3  md:h-14 md:w-14"
                        aria-hidden="true"
                      />
                    ) : (
                      <MenuIcon
                        className="block h-10 w-10 mt-3 md:h-14 md:w-14"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                  <div
                    className={`absolute inset-0 flex justify-center h-full mt-4 lg:hidden`}
                  >
                    <div className="w-52 aspect-video relative mt-2 z-40 ">
                      <NextImage
                        src={logo}
                        alt="Augenblick Logo"
                        className="block lg:hidden"
                      />
                    </div>
                  </div>
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

const MenuDesk = () => {
  return (
    <div className={`flex-1 flex container lg:items-stretch md:justify-start`}>
      <div className="hidden lg:block relative">
        <NextImage
          src={logo}
          alt="Augenblick Logo"
          className="hidden lg:block w-44 mr-12 "
        />
      </div>
      <div className="hidden lg:ml-6 lg:flex lg:space-x-6  justify-center items-center">
        {navigationLinks.map((link) => {
          return (
            <div key={link.name}>
              <Link to={link.href} spy={true} smooth={true} duration={500}>
                <span className="cursor-pointer border-transparent text-gray-800 px-1 pt-2 text-sm  block uppercase hover:text-fuchsia-500 lg:text-sm xl:text-base 2xl:text-lg">
                  {link.name}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MenuMobil: React.FC<{ open: boolean }> = ({ open }) => {
  const styles = useSpring({
    to: { opacity: open ? 1 : 0, x: open ? 0 : 100 },
    from: { opacity: 0, x: 0 },
  });

  const styles2 = useSpring({
    to: { opacity: open ? 1 : 0 },
    from: { opacity: 0 },
  });

  const links = navigationLinks.map((link) => {
    return (
      <Disclosure.Button
        key={link.name}
        as="a"
        href={link.href}
        className="border-transparent text-gray-700 block py-2 text-base font-medium"
      >
        <animated.div style={styles}>{link.name}</animated.div>
      </Disclosure.Button>
    );
  });

  return (
    <animated.div style={styles2}>
      <Disclosure.Panel className="fixed inset-0 h-screen w-full z-30 flex pl-12 items-center bg-fuchsia-100 lg:hidden">
        <div className="pt-2 pb-4 space-y-2">{links}</div>
      </Disclosure.Panel>
    </animated.div>
  );
};
