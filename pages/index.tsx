import type { NextPage } from 'next';
import AnfahrtSection from '../components/Anfahrt';
import HeroSection from '../components/Hero';
import BuchungsSection from '../components/Buchung';
import PartnerSection from '../components/Partner';
import AngebotSection from '../components/Angebot';
import SandraComponent from '../components/Sandra';
import Slider from '../components/Impressionen';
import { IBlurOutput } from '../components/Images/types';
import Testimonials from '../components/Testimonials';
import StrongLash from '../components/StrongLash';

interface IProps {
  images: IBlurOutput;
}

const Home: NextPage<IProps> = ({ images }) => {
  return (
    <div className='font-sans relative'>
      <HeroSection />
      <SandraComponent />
      <AngebotSection />
      <Testimonials />
      <StrongLash />
      <Slider />
      <BuchungsSection />
      <PartnerSection />
      <AnfahrtSection />
    </div>
  );
};

export default Home;
