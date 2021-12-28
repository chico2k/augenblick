import type { NextPage } from 'next';
import AnfahrtSection from '../components/Main/Anfahrt';
import ArbeitSection from '../components/Main/Arbeit';
import Testimonials from '../components/Main/Testimonials';
import HeroSection from '../components/Header/Hero';
import StudionSection from '../components/Main/Studio';
import BuchungsSection from '../components/Main/Buchung';
import PartnerSection from '../components/Main/Partner';
import AngebotSection from '../components/Main/Angebot';

const Home: NextPage = () => {
  return (
    <main className='mb-8'>
      <HeroSection />
      <AngebotSection />
      <ArbeitSection />
      <StudionSection />
      <Testimonials />
      <BuchungsSection />
      <PartnerSection />
      <AnfahrtSection />
    </main>
  );
};

export default Home;
