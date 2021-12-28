import '../styles/globals.css';
import type { AppProps } from 'next/app';
import HeaderSection from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeaderSection />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
