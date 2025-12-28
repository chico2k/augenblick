"use client";

import { useEffect, useMemo, useState } from "react";
import { setCookie, hasCookie, getCookie } from "cookies-next/client";

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
