import React from "react";
import { Element } from "react-scroll";
import background from "public/angebot/background.png";
import NextImage from "next/image";

const products = [
  {
    id: 1,
    title: "Lash Lift",
    subTitle: "Keratin Boost & Laminierung",
    price: 49,
    popular: false,
    footer: "",
  },
  {
    id: 2,
    title: "Verlängerung",
    subTitle: "1 zu 1 Technik",
    price: 75,
    popular: true,
    footer: "Auffüllen 35€ (bis zu drei Wochen nach Termin)",
  },
  {
    id: 3,
    title: "Verlängerung",
    subTitle: "Light Volumen",
    price: 95,
    popular: false,
    footer: "Auffüllen 50€ (bis zu drei Wochen nach Termin)",
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
    <section id="angebot">
      <Element name="angebot">
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
                        <div className="my-6 text-center">
                          <span className="align-center flex items-start justify-center px-3 text-6xl tracking-tight text-gray-900">
                            <span className="text-6xl">{product.price}</span>
                            <span className="text-3xl font-medium">€</span>
                          </span>
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
      </Element>
    </section>
  );
};

export default AngebotSection;
