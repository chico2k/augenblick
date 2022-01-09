import '../styles/globals.css';
import '../components/Main/Sandra/sandraStyles.css';
import 'keen-slider/keen-slider.min.css';
import type { AppProps } from 'next/app';
import HeaderSection from '../components/Header';
import Footer from '../components/Footer';
import { useLaxLibrary } from '../lib/laxy';

function MyApp({ Component, pageProps }: AppProps) {
  // useLaxLibrary();
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
