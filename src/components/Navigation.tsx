import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import React from "react";
import NextImage from "next/image";
import { Link } from "react-scroll";
import { navigationLinks } from "../lib/links";
import NextLink from "next/link";
import logo from "public//navigation/augenblick.png";
import { useSpring, animated } from "react-spring";

const Navigation = () => {
  return (
    <header className="absolute inset-x-0 z-50 overscroll-auto ">
      <Disclosure as="nav" className="mx-auto mb-2 max-w-7xl">
        {({ open, close }) => {
          if (typeof window !== "undefined" && open)
            document.body.style.overflow = "hidden";
          if (typeof window !== "undefined" && !open)
            document.body.style.overflow = "auto";

          return (
            <>
              <div className="mx-auto mt-4 max-w-7xl px-6 ">
                <div className="flex justify-between ">
                  <Disclosure.Button className="z-40  inline-flex items-center rounded-md text-fuchsia-500 hover:text-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fuchsia-300 lg:hidden ">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon
                        className="mt-3 block h-10 w-10 md:h-14 md:w-14"
                        aria-hidden="true"
                      />
                    ) : (
                      <MenuIcon
                        className="mt-3 block h-10 w-10 md:h-14 md:w-14"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                  <div
                    className={`absolute inset-0 mt-4 flex h-full justify-center lg:hidden`}
                  >
                    <div className="relative z-40 mt-4 aspect-video w-36 md:w-64">
                      <NextLink href="/">
                        <NextImage
                          src={logo}
                          alt="Augenblick Logo"
                          className="block lg:hidden"
                        />
                      </NextLink>
                    </div>
                  </div>
                  <MenuDesk close={close} />
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

const MenuDesk = ({ close }: { close: () => void }) => {
  return (
    <div className={`flex max-w-7xl flex-1 md:justify-start lg:items-stretch`}>
      <div className="relative hidden pt-2 lg:block">
        <NextLink href="/">
          <NextImage
            src={logo}
            alt="Augenblick Logo"
            className="mr-12 hidden w-52 lg:block "
          />
        </NextLink>
      </div>
      <div className="hidden   flex-shrink-0 items-center justify-center lg:ml-6  lg:flex lg:space-x-6">
        {navigationLinks.map((link) => {
          return (
            <div key={link.name}>
              <Link to={link.href} spy={true} smooth={true} duration={500}>
                <span
                  className="block cursor-pointer border-transparent px-1 pt-2 text-sm uppercase text-gray-800 hover:text-fuchsia-500 lg:text-base xl:text-lg"
                  onClick={() => close()}
                >
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
        className="block border-transparent py-2 text-2xl text-gray-700 md:text-3xl "
      >
        <animated.div style={styles}>
          <Link to={link.href} spy={true} smooth={true} duration={500}>
            <Disclosure.Button>{link.name}</Disclosure.Button>
          </Link>
        </animated.div>
      </Disclosure.Button>
    );
  });

  return (
    <animated.div style={styles2}>
      <Disclosure.Panel className="fixed inset-0 z-30  flex h-screen max-h-screen items-center justify-center bg-fuchsia-100 text-center lg:hidden">
        <div className="space-y-4 pt-2 pb-4">{links}</div>
      </Disclosure.Panel>
    </animated.div>
  );
};
