import NextImage from "next/image";

import wimpern from "/public/sandra/lashes.png";
import sandra from "/public/sandra/sandra.jpg";

const SandraComponent: React.FunctionComponent = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div
          className="px-5 my-56 sm:container md:grid md:grid-cols-2 md:gap-8 lg:gap-12"
          id="me"
        >
          <div className="relative">
            <h2 className="text-fuchsia-500 text-2xl mb-8 w-full md:text-3xl md:mb-16 lg:text-6xl">
              Sandra Rudic
            </h2>
            <p className="text-base mb-9 md:text-base md:pr-3 lg:text-xl lg:pr-24">
              Ich bin{" "}
              <span className="text-fuchsia-500">
                zertifizierte Wimpernstylistin
              </span>{" "}
              aus Traunreut. Mit Liebe und Leidenschaft, möchte ich für meinen
              Kundinnen einen perfektes Ergenbnis zielen.
              <br />
              <br />
              Für meine Kundinnen nehmen ich mir gerne ausreichend Zeit, um das
              <span className="text-fuchsia-500"> perfekt Ergebnis</span> zu
              erzielen. <br />
              <br /> Deine{" "}
              <span className="text-fuchsia-500">
                Wünsche und eine professionelle Beratung{" "}
              </span>
              stehen immer im Vordergrund.
            </p>
            <NextImage
              src={wimpern}
              placeholder="blur"
              className="object-cover max-w-xs mt-8 hidden xl:block lax__sandra__wimpern transition-all"
              alt="Bild von Sandra"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg h-auto ">
            <NextImage
              src={sandra}
              placeholder="blur"
              className="object-contain"
              alt="Bild von Wimpern"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default SandraComponent;
