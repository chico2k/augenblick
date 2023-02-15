import React, { useEffect, useState } from "react";
import Link from "next/link";
import { setCookie, hasCookie } from "cookies-next";

function Consent() {
  const [consent, setConsent] = useState(true);
  useEffect(() => {
    setConsent(hasCookie("localConsent"));
  }, []);

  const acceptCookie = () => {
    setConsent(true);
    setCookie("localConsent", "true", { maxAge: 60 * 60 * 24 * 365 });

    gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
    });

    console.log("accepting cookies");
  };
  const closeP = () => {
    setConsent(true);
  };
  const denyCookie = () => {
    setConsent(true);
    setCookie("localConsent", "false", { maxAge: 60 * 60 * 24 * 365 });
    console.log("denying cookie");
  };
  if (consent === true) {
    return null;
  }
  return (
    <section
      className={`fixed bottom-0 left-0 w-full py-2 md:py-4 ${
        consent ? "hidden" : ""
      } z-30`}
    >
      <div className="flex flex-col items-start px-5 py-3 space-y-2 bg-gray-200 md:flex-row md:space-y-0 md:items-stretch md:space-x-2">
        <div className="flex items-center flex-grow text-gray-900">
          <p className="text-sm ">
            Diese Website nutzt Dienste, die Cookies verwenden, um ein besseres
            Erlebnis zu bieten und den Datenverkehr zu analysieren. Mehr über
            die von uns genutzten Dienste erfahren Sie in unserer{" "}
            <Link
              href="/datenschutz"
              className="text-sm underline hover:text-lightAccent"
            >
              Datenschutzrichtlinie
            </Link>
          </p>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={acceptCookie}
            className="mr-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={denyCookie}
            className="inline-flex items-center rounded-md border border-transparent bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Zustimmen
          </button>
        </div>
      </div>
    </section>
  );
}

export default Consent;
