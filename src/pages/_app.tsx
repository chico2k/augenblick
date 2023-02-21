import "../styles/globals.css";
import "keen-slider/keen-slider.min.css";
import type { AppProps } from "next/app";
import Footer from "../components/Footer";
import Navigation from "../components/Header/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import Consent, { useConsent } from "../components/CookieConsent";

function MyApp({ Component, pageProps }: AppProps) {
  const { consent } = useConsent();

  return (
    <>
      <Script
        id="gtag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied'
          });

          gtag('config', 'G-53QMDPJ',{ 'debug_mode':true });


        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-53QMDPJ')`,
        }}
      />

      {consent.ad_storage === "granted" && (
        <Script
          id="consupd"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `

            gtag('consent', 'update', ${JSON.stringify(consent)});
            
          `,
          }}
        />
      )}

      <Navigation />
      <Component {...pageProps} />
      <ToastContainer />
      <Consent />
      <Footer />
    </>
  );
}

export default MyApp;