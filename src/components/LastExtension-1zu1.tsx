import React from "react";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import BuchungsSection from "./Buchung";
import Slider from "./Impressionen";
import banner from "/public/lashextension-1zu1/banner.png";
import NextImage from "next/image";

const LashExtension1zu1 = () => {
  return (
    <section>
      <div className="bg-white py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <p className="text-base font-semibold leading-7 text-fuchsia-600">
            Lashextension
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Atemberaubenden Augenaufschlag mit Lashextensions
          </h1>
          <p className="mt-6 text-xl leading-8">
            Lashextensions sind eine großartige Möglichkeit, um deinen Augen
            einen wunderschönen und ausdrucksstarken Look zu verleihen. Sie
            verlängern und verdichten deine natürlichen Wimpern, ohne dass du
            Mascara oder falsche Wimpern verwenden musst. Wenn du einen
            natürlichen, aber dennoch dramatischen Augenaufschlag möchtest, dann
            sind Lashextensions definitiv einen Versuch wert.
          </p>
          <div className="mt-10 max-w-2xl">
            <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
              Was sind Lashextension?
            </h2>
            <p className="mt-6">
              Lashextensions, auch Wimpernverlängerungen genannt, sind
              künstliche Wimpern, die man auf deine natürlichen Wimpern einzeln
              aufklebt, um ihnen mehr Länge, Fülle und Definition zu verleihen.
              Das Verfahren wird oft von professionellen Kosmetikern oder
              Wimpern-Stylisten durchgeführt.
              <br /> <br />
              Die künstlichen Wimpern sind in verschiedenen Größen, Krümmungen
              und Materialien erhältlich, wie z.B. Synthetik, Seide oder
              Nerzhaar. Die Wimpern werden dann mit einem speziellen Kleber auf
              deine natürlichen Wimpern geklebt, wodurch sie länger und
              voluminöser erscheinen. Das Ergebnis sieht natürlich aus und
              verleiht deinen Augen einen wachen und ausdrucksstarken Look.
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
              Lashextension - 1 zu 1 Technik
            </figcaption>
          </figure>
          <div className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Was ist 1:1 Technik bei Lashextensions?
            </h2>
            <p className="mt-6">
              Die 1:1 Technik bei Lashextensions ist eine Methode, bei der jeder
              künstliche Wimpernstrang auf eine natürliche Wimper appliziert
              wird. Das bedeutet, dass jede einzelne natürliche Wimper eine
              einzige künstliche Wimper bekommt, die mit einem speziellen
              Wimpernkleber befestigt wird.
              <br /> <br />
              Die 1:1 Technik wird auch als &quot;klassische Technik&quot;
              bezeichnet und ist eine der am häufigsten verwendeten Methoden bei
              Lashextensions. Sie erzeugt einen natürlicheren Look als andere
              Techniken, da sie nur eine zusätzliche Wimper pro natürlicher
              Wimper hinzufügt.
              <br /> <br />
              Nach dem Einwirken wird das Lifting-Gel entfernt und die Wimpern
              werden vorsichtig in die gewünschte Form gebracht und mit einem
              Fixierungsmittel fixiert. Das Fixierungsmittel enthält ebenfalls
              pflegende Inhaltsstoffe, um deine Wimpern zu stärken und zu
              schützen. Nach dem Fixieren wird das Fixierungsmittel ebenfalls
              für etwa 8 bis 12 Minuten einwirken gelassen.
              <br /> <br />
              Die 1:1 Technik eignet sich besonders für Kunden, die einen
              subtilen Look wünschen und die natürliche Schönheit ihrer Wimpern
              hervorheben möchten. Da diese Methode eine längere Anwendungsdauer
              erfordert, ist sie möglicherweise nicht so schnell wie andere
              Methoden, aber sie erzeugt ein sehr natürliches und schönes
              Ergebnis.
            </p>
          </div>
          <div className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Was sind die Vorteile von Lashextension?
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
                    Längere und vollere Wimpern:{" "}
                  </strong>{" "}
                  Lashextensions verleihen deinen Wimpern mehr Länge und
                  Volumen, ohne dass du Mascara oder falsche Wimpern verwenden
                  musst. Sie machen deinen Augenaufschlag dramatischer und
                  verleihen deinem Gesicht eine wunderschöne Ausstrahlung.
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-fuchsia-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Zeitersparnis:
                  </strong>{" "}
                  Da du keine Mascara mehr auftragen musst, kannst du Zeit
                  sparen, die du ansonsten für dein tägliches Make-up benötigen
                  würdest. Außerdem sparst du Zeit beim Entfernen von Make-up,
                  da du keine Mascara mehr entfernen musst.
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-fuchsia-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Natürlicher Look:
                  </strong>{" "}
                  Lashextensions sind so gestaltet, dass sie deinen natürlichen
                  Wimpern ähneln und einen natürlichen Look erzeugen. Das
                  Ergebnis sieht daher sehr natürlich aus und hebt die Schönheit
                  deiner Augen hervor.
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-fuchsia-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Langlebigkeit:
                  </strong>{" "}
                  Im Gegensatz zu Mascara, die im Laufe des Tages abblättern
                  oder verschmieren kann, halten Lashextensions länger. Je nach
                  Wachstumszyklus deiner natürlichen Wimpern können sie bis zu 4
                  bis 6 Wochen halten, bevor sie nachgebessert werden müssen.
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Wie läuft eine Lashextension-Behandlung ab?
            </h2>
            <p className="mt-6">
              Eine Lashextension-Behandlung beginnt mit einem kurzen
              Beratungsgespräch. Dabei besprichen wir die gewünschte
              Wimpernform, -länge und -krümmung.
              <br /> <br />
              Danach werden die unteren Wimpern mit einem speziellen Klebeband
              abgedeckt, um sie während der Behandlung zu schützen. Der
              Wimpern-Stylist wählt dann die passenden künstlichen Wimpern aus,
              um sie individuell auf jede einzelne natürliche Wimper
              aufzutragen.
              <br /> <br />
              Die Wimpernverlängerungen werden mit einem speziellen
              Wimpernkleber auf die natürlichen Wimpern geklebt. Der Kleber ist
              hautfreundlich und unsichtbar, so dass er nicht irritiert oder zu
              Allergien führt. Der Prozess kann zwischen 1,5 und 2,5 Stunden
              dauern, abhängig von der Anzahl der Wimpern, die aufgetragen
              werden sollen.
              <br /> <br />
              Nach Abschluss der Behandlung solltest du vermeiden, deine Wimpern
              für mindestens 24 Stunden nass zu machen, um sicherzustellen, dass
              der Kleber vollständig aushärtet. Du solltest auch vermeiden,
              deine Wimpern zu reiben oder zu ziehen, um das Risiko des
              Ausfallens der Wimpern zu minimieren.
              <br /> <br />
              In der Regel solltest du alle 3-4 Wochen eine Auffüllung
              durchführen lassen, um sicherzustellen, dass deine
              Wimpernverlängerungen in bestem Zustand bleiben.
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

export default LashExtension1zu1;
