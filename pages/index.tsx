import type { NextPage } from 'next';
import AnfahrtSection from '../components/Main/Anfahrt';
import Testimonials from '../components/Main/Testimonials';
import HeroSection from '../components/Main/Hero';
import StudionSection from '../components/Main/Studio';
import BuchungsSection from '../components/Main/Buchung';
import PartnerSection from '../components/Main/Partner';
import AngebotSection from '../components/Main/Angebot';
import SandraComponent from '../components/Main/Sandra';
import Slider from '../components/Main/Impressionen/';
import { blurHandler } from '../lib/blurHandler';
import { IBlurOutput } from '../components/Images/types';

interface IProps {
  images: IBlurOutput;
}

const Home: NextPage<IProps> = ({ images }) => {
  return (
    <div className='font-sans'>
      <HeroSection heroSectionImages={images.heroSectionImages} />
      <SandraComponent sandraSectionImages={images.sandraSectionImages} />
      <AngebotSection />
      <Testimonials
        testimonialsSectionImages={images.testimonialsSectionImages}
      />

      <StudionSection />
      <Slider slideSectionImages={images.slideSectionImages} />
      <BuchungsSection />
      <PartnerSection />
      <AnfahrtSection />
    </div>
  );
};

export const getStaticProps = async () => {
  const images = await blurHandler();
  const props = {
    props: {
      images,
    },
  };

  return props;
};

export default Home;
