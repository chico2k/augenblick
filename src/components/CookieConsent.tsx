import Link from "next/link";
import { useConsent } from "../lib/hooks/useConsent";

function Consent() {
  const { consent, acceptCookie, denyCookie, hasLoaded } = useConsent();

  if (!hasLoaded) return null;
  return (
    <section
      className={`fixed bottom-0 left-0 w-full py-2 md:py-4 ${
        consent.ad_storage === "granted" ? "hidden" : ""
      } z-30`}
    >
      <div className="flex  flex-col items-start space-y-2 bg-gray-200 px-3 py-2 md:flex-row md:items-stretch md:space-y-0 md:space-x-2 md:py-3">
        <div className="mx-auto flex max-w-6xl flex-grow items-center text-gray-900">
          <p className="mb-1 text-xs md:mb-2 md:text-sm ">
            Diese Website nutzt Dienste, die Cookies verwenden. Mehr in der{" "}
            <Link
              href="/datenschutz"
              className="hover:text-lightAccent underline"
            >
              Datenschutzrichtlinie
            </Link>
          </p>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={denyCookie}
            className="mr-4 inline-flex items-center rounded-md border  bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:px-4 md:text-sm"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={acceptCookie}
            className="inline-flex items-center rounded-md border  bg-fuchsia-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:px-4 md:text-sm"
          >
            Zustimmen
          </button>
        </div>
      </div>
    </section>
  );
}

export default Consent;
