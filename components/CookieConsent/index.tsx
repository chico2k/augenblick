import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { setCookie, hasCookie, getCookie } from "cookies-next";

export const useConsent = () => {
  const defaultConsent = useMemo(() => {
    return { ad_storage: "denied", analytics_storage: "denied" };
  }, []);

  const grantedConsent = {
    ad_storage: "granted",
    analytics_storage: "granted",
  };

  const [consent, setConsent] = useState(defaultConsent);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (hasCookie("localConsent")) {
      const consent = getCookie("localConsent") as string;
      setHasLoaded(true);
      return setConsent(JSON.parse(consent));
    }

    setCookie("localConsent", defaultConsent, { maxAge: 60 * 60 * 24 * 365 });
    setHasLoaded(true);
    return setConsent(defaultConsent);
  }, [defaultConsent]);

  const acceptCookie = () => {
    setConsent(grantedConsent);

    setCookie(
      "localConsent",
      {
        ad_storage: "granted",
        analytics_storage: "granted",
      },
      { maxAge: 60 * 60 * 24 * 365 }
    );

    gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
    });

    console.log("update consent");
  };

  const closeCookie = () => {
    setConsent(grantedConsent);
  };

  const denyCookie = () => {
    setConsent(defaultConsent);
    setCookie("localConsent", defaultConsent, { maxAge: 60 * 60 * 24 * 365 });
  };
  return { consent, acceptCookie, denyCookie, closeCookie, hasLoaded };
};

function Consent() {
  const { consent, acceptCookie, denyCookie, closeCookie, hasLoaded } =
    useConsent();

  if (!hasLoaded) return;
  return (
    <section
      className={`fixed bottom-0 left-0 w-full py-2 md:py-4 ${
        consent.ad_storage === "granted" ? "hidden" : ""
      } z-30`}
    >
      <div className="flex flex-col items-start px-5 py-3 space-y-2 bg-gray-200 md:flex-row md:space-y-0 md:items-stretch md:space-x-2">
        <div className="flex items-center flex-grow text-gray-900">
          <p className="text-xs mb-2 md:text-sm ">
            Diese Website nutzt Dienste, die Cookies verwenden, um ein besseres
            Erlebnis zu bieten und den Datenverkehr zu analysieren. Mehr über
            die von uns genutzten Dienste erfahren Sie in unserer{" "}
            <Link
              href="/datenschutz"
              className="underline hover:text-lightAccent"
            >
              Datenschutzrichtlinie
            </Link>
          </p>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={denyCookie}
            className="mr-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs md:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={acceptCookie}
            className="inline-flex items-center rounded-md border border-transparent bg-fuchsia-600 px-4 py-2 text-xs md:text-sm font-medium text-white shadow-sm hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Zustimmen
          </button>
        </div>
      </div>
    </section>
  );
}

export default Consent;
