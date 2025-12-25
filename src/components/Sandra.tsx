"use client";

import NextImage from "next/image";
import wimpern from "/public/sandra/lashes.png";
import sandra from "/public/sandra/sandra.png";
import { Element } from "react-scroll";

const SandraComponent: React.FunctionComponent = () => {
  return (
    <Element name="me">
      <section
        className="mx-auto max-w-7xl py-28 md:grid md:grid-cols-2 md:gap-8 md:py-56 lg:gap-12 "
        id="sandra"
      >
        <div className="relative px-5 ">
          <h2 className="mb-8 w-full text-6xl text-fuchsia-600 md:mb-12 lg:text-8xl">
            Sandra
          </h2>
          <p className="mb-9 text-base md:pr-3 md:text-base lg:pr-6 lg:text-xl ">
            Ich bin{" "}
            <span className="text-fuchsia-600">
              zertifizierte Wimpernstylistin
            </span>{" "}
            aus Traunreut. Mit Liebe und Leidenschaft, möchte ich für meine
            Kundinnen ein perfektes Ergenbnis zielen.
            <br />
            <br />
            Für meine Kundinnen nehmen ich mir gerne ausreichend Zeit, um das
            <span className="text-fuchsia-600"> perfekt Ergebnis</span> zu
            erzielen. <br />
            <br /> Deine{" "}
            <span className="text-fuchsia-600">
              Wünsche und eine professionelle Beratung{" "}
            </span>
            stehen immer im Vordergrund.
          </p>
          <NextImage
            src={wimpern}
            placeholder="blur"
            className="mt-8 hidden max-w-xs object-cover transition-all xl:block "
            alt="Bild von Sandra"
          />
        </div>
        <div className="relative h-auto max-w-xl md:rounded-lg">
          <NextImage
            src={sandra}
            placeholder="blur"
            className="object-contain"
            alt="Bild von Wimpern"
          />
        </div>
      </section>
    </Element>
  );
};
export default SandraComponent;
