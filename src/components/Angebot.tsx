"use client";

import React from "react";
import background from "/public/angebot/background.png";
import NextImage from "next/image";
import { Element } from "react-scroll";
import NextLink from "next/link";

const products = [
  {
    id: 1,
    title: "Lash Lift",
    subTitle: "Keratin Boost & Laminierung",
    price: 49,
    popular: false,
    footer: "",
    href: "/lashlift",
  },
  {
    id: 2,
    title: "Verlängerung",
    subTitle: "1 zu 1 Technik",
    price: 90,
    popular: true,
    footer: "Auffüllen 45€ (bis zu drei Wochen nach Termin)",
    href: "/lashextension-1-zu-1-technik",
  },
  {
    id: 3,
    title: "Verlängerung",
    subTitle: "Light Volumen",
    price: 110,
    popular: false,
    footer: "Auffüllen 55€ (bis zu drei Wochen nach Termin)",
    href: "/lashextension-volumentechnik",
  },
];

const MostPopular: React.FC<{ mostPopular: boolean }> = ({ mostPopular }) => {
  if (!mostPopular) return null;
  return (
    <div className="absolute inset-x-0 top-0 z-10 translate-y-px transform">
      <div className="flex -translate-y-1/2 transform justify-center ">
        <span className="lg:text-medium rounded-2xl bg-gradient-to-tl from-fuchsia-500  via-fuchsia-600 to-fuchsia-700 px-6 py-2   text-sm uppercase text-white   md:rounded-3xl  md:py-2 md:px-8 md:text-sm md:tracking-wider">
          Am beliebtesten
        </span>
      </div>
    </div>
  );
};

const AngebotSection = () => {
  return (
    <Element name="angebot">
      <section id="angebot">
        <div className="relative mx-auto overflow-hidden bg-gradient-to-tr from-fuchsia-100 via-fuchsia-300 to-fuchsia-500  px-5 pb-32">
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <NextImage
              alt="Hintergrundbild mit Wimpern"
              src={background}
              className="h-full w-full object-cover opacity-20 "
            />
          </div>
          <div className="mx-auto max-w-7xl px-4 ">
            <h3 className="py-10 text-center text-6xl text-white md:py-16 lg:py-16 lg:text-7xl ">
              Angebot
            </h3>
            <div className="mx-auto grid grid-cols-1 gap-3 md:grid md:grid-cols-3 lg:gap-8 ">
              {products.map((product) => {
                return (
                  <div className="relative " key={product.id}>
                    <MostPopular mostPopular={product.popular} />
                    <div className="relative flex items-center justify-center rounded-xl  border bg-white py-12 shadow-lg shadow-fuchsia-300/30  ">
                      <div className="w-full text-center  ">
                        <h3 className="text- gray-600 text-3xl uppercase md:text-2xl lg:text-3xl">
                          {product.title}
                        </h3>
                        <div className="mt-1 text-center text-base font-light text-fuchsia-700 lg:text-lg">
                          {product.subTitle}
                        </div>
                        <div className="mt-6 text-center">
                          <span className="align-center flex items-start justify-center px-3 text-6xl tracking-tight text-gray-900">
                            <span className="text-6xl">{product.price}</span>
                            <span className="text-3xl font-medium">€</span>
                          </span>
                        </div>
                        <div className="my-3 cursor-pointer text-sm font-semibold leading-6 text-fuchsia-600 hover:text-fuchsia-700">
                          <NextLink href={product.href}>
                            Erfahre mehr <span aria-hidden="true">→</span>
                          </NextLink>
                        </div>
                        <div className="absolute bottom-0 mt-8 w-full px-4 py-2 text-xs ">
                          {product.footer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Element>
  );
};

export default AngebotSection;
