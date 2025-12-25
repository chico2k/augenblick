import React from "react";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import banner from "/public/lashextension-volumen/banner.png";
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
            Mascara verwenden musst. Wenn du einen natürlichen, aber dennoch
            dramatischen Augenaufschlag möchtest, dann sind Lashextensions
            definitiv einen Versuch wert.
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
              und Materialien erhältlich. Die Wimpern werden dann mit einem
              speziellen Kleber auf deine natürlichen Wimpern geklebt, wodurch
              sie länger und voluminöser erscheinen. Das Ergebnis sieht
              natürlich aus und verleiht deinen Augen einen wachen und
              ausdrucksstarken Look.
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
              Lashextension
            </figcaption>
          </figure>
          <div className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Was ist Volumentechnik bei Lashextensions?
            </h2>
            <p className="mt-6">
              Die Volumentechnik bei Lashextensions ist eine Methode, bei der
              mehrere künstliche Wimpernfächer auf eine natürliche Wimper
              appliziert werden, ähnlich wie bei der klassischen 1:1 Technik.
              Der Unterschied besteht jedoch darin, dass bei der Volumentechnik
              mehrere feinere künstliche Wimperfächer verwendet werden, um ein
              Volumeneffekt zu erzielen.
              <br /> <br />
              Die Volumentechnik eignet sich besonders für Kunden, die einen
              dramatischeren Look wünschen und für diejenigen, die von Natur aus
              dünnere oder weniger Wimpern haben. Da bei dieser Technik mehrere
              künstliche Wimpern auf eine natürliche Wimper appliziert werden,
              kann das Ergebnis voluminöser und auffälliger sein als bei der
              klassischen 1:1 Technik.
            </p>
          </div>
          <div className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Was sind die Vorteile von Lashextension?
            </h2>

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
                  Volumen, ohne dass du Mascara verwenden musst. Sie machen
                  deinen Augenaufschlag dramatischer und verleihen deinem
                  Gesicht eine wunderschöne Ausstrahlung.
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
                    Langlebigkeit:
                  </strong>{" "}
                  Im Gegensatz zu Mascara, die im Laufe des Tages abblättern
                  oder verschmieren kann, halten Lashextensions länger. Je nach
                  Wachstumszyklus deiner natürlichen Wimpern können sie bis zu 3
                  bis 4 Wochen halten, bevor sie aufgefüllt werden müssen.
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
              Beratungsgespräch. Dabei besprechen wir die gewünschte
              Wimpernform, -länge und -krümmung.
              <br /> <br />
              Danach werden die unteren Wimpern mit einem speziellen Klebeband
              abgedeckt, um sie während der Behandlung zu schützen. Der
              Wimpern-Stylist wählt dann die passenden künstlichen Wimpern aus,
              um sie individuell auf jede einzelne natürliche Wimper
              aufzutragen.
              <br /> <br />
              Die Wimpernverlängerungen werden mit einem speziellen
              Wimpernkleber auf die natürlichen Wimpern geklebt. Der Prozess
              kann zwischen 2,5 und 3 Stunden dauern, abhängig von der Anzahl
              der Wimpern, die aufgetragen werden sollen.
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
    </section>
  );
};

export default LashExtension1zu1;
