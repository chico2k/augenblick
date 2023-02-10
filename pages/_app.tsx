import '../styles/globals.css';
import 'keen-slider/keen-slider.min.css';
import type { AppProps } from 'next/app';
import HeaderSection from '../components/Header';
import Footer from '../components/Footer';
import { useLaxLibrary } from '../lib/laxy';
import ScrollNav from '../components/Header/Navigation/MenuDesk/scroll';
import Navigation from '../components/Header/Navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  useLaxLibrary();
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
      <ToastContainer />
      <Footer />
    </>
  );
}

export default MyApp;
