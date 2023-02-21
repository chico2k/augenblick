import NextImage from "next/image";
import bg from "/public/testimonials/bg.png";

const testimonials = [
  {
    content:
      "Ich war heute das erste mal beim Lifting und Sandra hat mir jegliche Angst genommen! So eine liebe Person! Ich bin extrem zufrieden, es war eine sehr schöne Behandlung. Wahnsinn! Jederzeit wieder!",
    name: "Melanie",
  },

  {
    content:
      "Ich war total zufrieden, habe ein Lashlifting bei der lieben Sandra machen lassen. Tob Ergebnis und eine Super Beratung. Die einzelnen Schritte erklärt Sie ganz genau, so dass man weiß was am Auge gemacht wird. Ich habe mich sehr Wohlgefühlt, man merkt dass sie Spaß an Ihrer Arbeit hat.",
    name: "Jasmina",
  },

  {
    content: `Mein erster Termin war mega schön und Sandra weiß immer genau was sie macht. Ihr ist sehr wichtig das alles perfekt sitzt und der Kunde zufrieden ist. Man fühlt sich sehr sehr wohl und es ist eine super entspannte Atmosphäre. Ich bin sehr begeistert und werde jetzt immer zu ihr gehen.`,
    name: "Pauline",
  },
  {
    content:
      "Sandra ist einfach die Beste! Bin als absoluter Lashes-Neuling zu ihr gekommen und hab mich von Anfang an super wohl und unglaublich gut aufgehoben gefühlt. Die Atmosphäre ist locker und es ist immer lustig. Die Ergebnisse sind atemberaubend schön, das Preis-Leistungs-Verhältnis unschlagbar gut! Klare Weiterempfehlung!",
    name: "Annalena",
  },
  {
    content:
      "Sehr schôner Saloon mit sehr lieben und freundlichem Personal dass zudem auch noch sehr gut ihr Handwerk verstehen. Noch nie waren meine Wimpern so schôn.wie bei Sandra. 1000% Empfehlung",
    name: "Roswitha",
  },
  {
    content:
      "Es war richtig cool. Mein erstes Mal Wimpern Lifting und Sandra hat alles gut erklärt, ich wusste also vorab was passiert. Der Schwung, die Farbe und wie lange es hält ist einfach krass genial. Hab seit 2 Wochen keinen Mascara mehr genutzt. Und am Ende noch ein Bürstchen bekommen. Voll cool. Also echt zu empfehlen!!!",
    name: "Susan",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="Was meine Kundeninnen sagen"
      className=" transparent relative mx-auto py-20  sm:pb-24 sm:pt-32 lg:pb-40 lg:pt-48"
    >
      <NextImage
        alt="Hitergrundbild mit Herzen und Wimpern"
        src={bg}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="container z-20 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl md:text-center lg:max-w-7xl">
          <h2 className="font-display z-20 px-4 text-3xl text-fuchsia-500 sm:text-4xl lg:text-6xl ">
            Meine Kundinnen lieben das Ergebnis.
          </h2>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="gap-y-6 sm:gap-y-8">
                <li
                  key={columnIndex}
                  className=" relative  rounded-2xl p-6 shadow-xl shadow-slate-900/10"
                >
                  <figure className="flex  flex-col">
                    <svg
                      aria-hidden="true"
                      width={105}
                      height={78}
                      className="absolute top-6 left-6 fill-slate-100"
                    >
                      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
                    </svg>
                    <blockquote className="relative">
                      <p className=" text-sm text-slate-900 md:text-base">
                        {column.content}
                      </p>
                    </blockquote>
                    <figcaption className="relative mt-2 flex items-center justify-between border-t border-slate-100 pt-4 md:mt-4 md:pt-6">
                      <div className="flex w-full justify-between">
                        <div className="font-display text-sm text-slate-900 md:text-base">
                          {column.name}
                        </div>
                        <div className="-ml-1 text-yellow-400">
                          <Stars />
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 flex justify-center text-xl md:w-full">
        <a
          onClick={() => {
            console.log("hello");
          }}
          href="https://g.page/r/CcdoDyfEcWXWEBM/review"
          target={"_blank"}
          id="click-reviews-write"
          className="hbover:via-fuchsia-800 mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 px-6 py-3 text-base font-medium text-white 
                shadow-sm transition-all duration-300 ease-in-out  hover:bg-gradient-to-l hover:from-fuchsia-900 hover:to-fuchsia-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 sm:w-auto"
          rel="noreferrer"
        >
          Bewertung schreiben
        </a>
      </div>
      <div className="mt-4 flex justify-center text-base md:w-full md:text-xl">
        Alle Bewertungen findest du
        <a
          href="https://www.google.com/search?q=augenblick+chiemgau&oq=augenblick+chiem&aqs"
          target={"_blank"}
          rel="noreferrer"
          id="click-reviews-all"
        >
          <span className="text-fuchsia-500 hover:text-fuchsia-700 ">
            &nbsp; hier
          </span>
        </a>
      </div>
    </section>
  );
}

export default Testimonials;

const Stars = () => {
  return (
    <span className="flex ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </span>
  );
};
