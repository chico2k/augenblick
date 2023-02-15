import React from "react";
import { Element } from "react-scroll";
import background from "/public/angebot/background.png";
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
    <div className="absolute inset-x-0 top-0 transform translate-y-px">
      <div className="flex justify-center transform -translate-y-1/2 md">
        <span
          className="rounded-full tracking-wider bg-fuchsia-700  border-2 solid border-fuchsia-700  text-white text-xl px-6 py-2   tuppercase 

          md:text-sm md:py-2 md:px-8 md:rounded-3xl
          lgtext-medium
          "
        >
          Am beliebtesten
        </span>
      </div>
    </div>
  );
};

const AngebotSection = () => {
  const productList = products.map((product) => {
    return (
      <>
        <div className="mb-16 relative " key={product.id}>
          <MostPopular mostPopular={product.popular} />
          <div className="shadow-lg  shadow-fuchsia-300/30  h-72  rounded-xl flex items-center justify-center bg-white border ">
            <div className="w-full text-center">
              <div className="text-center ">
                <h3 className="text-xl md:text-2xl lg:text-3xl text-gray-600 uppercase">
                  {product.title}
                </h3>
                <div className="text-center mt-1 text-fuchsia-700 text-base lg:text-lg font-light">
                  {product.subTitle}
                </div>
                <div className="text-center mt-6">
                  <span className="px-3 flex items-start text-6xl tracking-tight text-gray-900 justify-center align-center">
                    <span className="text-6xl">{product.price}</span>
                    <span className="text-3xl font-medium">€</span>
                  </span>
                </div>
                <div className="mt-8 text-xs absolute inset-x-0">
                  {product.footer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  });

  return (
    <>
      <Element name="angebot">
        ‚
        <div
          className="   mt-36 bg-gradient-to-tr from-fuchsia-100 via-fuchsia-300 to-fuchsia-500  px-5 pb-64   relative overflow-hidden md:pb-12"
          id="offer"
        >
          <div className="h-full w-full absolute inset-0 overflow-hidden lax__angebot_background">
            <NextImage
              alt="Hintergrundbild mit Wimpern"
              src={background}
              className="w-full h-full object-cover  opacity-20 "
            />
          </div>
          <div className="md:container md:py-0">
            <h3 className=" text-2xl text-center text-white py-10 ^md:text-3xl lg:text-5xl lg:py-20">
              Angebot
            </h3>
            <div className=" gap-3 max-w-6xl mx-auto md:grid md:grid-cols-3  lg:gap-8 ">
              {productList}
            </div>
          </div>
        </div>
      </Element>
    </>
  );
};

export default AngebotSection;
