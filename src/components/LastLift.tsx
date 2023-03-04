import React from "react";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import BuchungsSection from "./Buchung";
import Slider from "./Impressionen";
import banner from "/public/lashlift/banner.png";
import NextImage from "next/image";

const LastLift = () => {
  return (
    <section>
      <div className="bg-white py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <p className="text-base font-semibold leading-7 text-fuchsia-600">
            Lashlifting
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Perfekt geschwungene Wimpern ohne künstliche Extensions
          </h1>
          <p className="mt-6 text-xl leading-8">
            Wer träumt nicht von langen, voluminösen Wimpern, die perfekt
            geschwungen sind? Lashlifting, auch bekannt als Wimpernlifting, ist
            eine großartige Möglichkeit, Ihre natürlichen Wimpern zu betonen und
            zu akzentuieren, ohne sich auf künstliche Extensions verlassen zu
            müssen.
          </p>
          <div className="mt-10 max-w-2xl">
            <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
              Was ist Lashlifting?
            </h2>
            <p className="mt-6">
              Lashlifting ist eine kosmetische Behandlung, die dazu dient, deine
              natürlichen Wimpern anzuheben und zu formen, um eine perfekte
              Krümmung zu erzeugen. Im Gegensatz zu künstlichen
              Wimpernverlängerungen oder Mascara, betont Lashlifting deine
              natürlichen Wimpern, ohne dass zusätzliche Wimpern erforderlich
              sind.
            </p>
          </div>
          <figure className="mt-6">
            <NextImage
              className="aspect-video rounded-xl bg-gray-50 object-cover"
              src={banner}
              alt="Bild von Lashlifting"
            />
            <figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
              <InformationCircleIcon
                className="mt-0.5 h-5 w-5 flex-none text-gray-300"
                aria-hidden="true"
              />
              Lashlifting
            </figcaption>
          </figure>

          <div className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Was sind die Vorteile von Lashlifting?
            </h2>
            <p className="mt-6">
              Lashlifting hat viele Vorteile im Vergleich zu künstlichen
              Wimpernverlängerungen oder Mascara. Hier sind einige der Vorteile
              von Lashlifting:
            </p>
            <ul role="list" className="mt-8 max-w-xl space-y-6 text-gray-600">
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-fuchsia-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Natürlicher Look:{" "}
                  </strong>{" "}
                  Lashlifting betont Ihre natürlichen Wimpern und verleiht ihnen
                  eine perfekte Krümmung, ohne dass künstliche Wimpern
                  erforderlich sind.
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-fuchsia-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Langanhaltende Wirkung:
                  </strong>{" "}
                  Das Ergebnis hält bis zu 6 Wochen an, sodass Sie nicht jeden
                  Tag Make-up auftragen müssen.
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-fuchsia-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Pflegeleicht:
                  </strong>{" "}
                  Es erfordert keine besondere Pflege und Sie können Ihre
                  Wimpern wie gewohnt waschen und schminken.
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-fuchsia-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Keine Allergien:
                  </strong>{" "}
                  Im Gegensatz zu künstlichen Wimpernverlängerungen verursacht
                  Lashlifting keine allergischen Reaktionen, da keine Klebstoffe
                  verwendet werden.
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Wie läuft eine Lashlifting-Behandlung ab?
            </h2>
            <p className="mt-6">
              Eine Lashlifting-Behandlung beginnt damit, dass deine Augen und
              Wimpern gründlich gereinigt werden, um alle Spuren von Make-up
              oder Öl zu entfernen. Anschließend werden unter deinen Augen
              Schutzpads angebracht, um deine Haut und unteren Wimpern vor dem
              Lifting-Gel und Fixierungsmittel zu schützen.
              <br /> <br />
              Danach wird das Lifting-Gel auf die Basis deiner Wimpern
              aufgetragen und sanft mit einem Applikator verteilt. Das Gel
              enthält in der Regel milde Inhaltsstoffe wie Keratin oder
              Aminosäuren, die dazu beitragen, deine Wimpern zu stärken und zu
              pflegen. Das Gel wird je nach Produkt zwischen 8 bis 12 Minuten
              einwirken gelassen.
              <br /> <br />
              Nach dem Einwirken wird das Lifting-Gel entfernt und die Wimpern
              werden vorsichtig in die gewünschte Form gebracht und mit einem
              Fixierungsmittel fixiert. Das Fixierungsmittel enthält ebenfalls
              pflegende Inhaltsstoffe, um deine Wimpern zu stärken und zu
              schützen. Nach dem Fixieren wird das Fixierungsmittel ebenfalls
              für etwa 8 bis 12 Minuten einwirken gelassen.
              <br /> <br />
              Sobald das Fixierungsmittel entfernt wurde, werden deine Wimpern
              mit einem Nährstoff-Serum behandelt, um sie zu stärken und zu
              pflegen. Das Serum kann auch dazu beitragen, dass deine Wimpern
              gesünder aussehen und glänzen.
              <br /> <br />
              Die Behandlung dauert in der Regel zwischen 45 Minuten bis zu
              einer Stunde und ist schmerzfrei. Nach der Behandlung kannst du
              deine Wimpern wie gewohnt waschen und schminken. Das Ergebnis des
              Lashliftings hält in der Regel zwischen 4 bis 6 Wochen an, je nach
              Wachstumszyklus deiner Wimpern.
            </p>
          </div>
        </div>
      </div>
      <Slider />

      <div className="my-32">
        <BuchungsSection />
      </div>
    </section>
  );
};

export default LastLift;
