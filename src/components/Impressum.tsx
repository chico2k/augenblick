import React from "react";

export const Impressum = () => {
  return (
    <section className="mx-auto max-w-7xl py-32 px-6">
      <div className="mx-auto">
        <h1 className="text-2xl">Impressum</h1>

        <h2 className="mt-4">Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
        <p>
          Sandra Galla
          <br />
          Augenblick Chiemgau
          <br />
          Hofer Str. 10 83301 Traunreut
        </p>

        <h2 className="pt-4">Kontakt</h2>
        <p>E-Mail: info@augenblick-chiemgau.com</p>

        <h2 className="pt-4">EU-Streitschlichtung</h2>
        <p>
          Die Europ&auml;ische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          .<br /> Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>

        <h2>
          Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle
        </h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </div>
    </section>
  );
};

export default Impressum;
