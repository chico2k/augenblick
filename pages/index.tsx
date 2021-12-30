import type { NextPage } from 'next';
import AnfahrtSection from '../components/Main/Anfahrt';
import ArbeitSection from '../components/Main/Arbeit';
import Testimonials from '../components/Main/Testimonials';
import HeroSection from '../components/Header/Hero';
import StudionSection from '../components/Main/Studio';
import BuchungsSection from '../components/Main/Buchung';
import PartnerSection from '../components/Main/Partner';
import AngebotSection from '../components/Main/Angebot';
import SandraComponent from '../components/Main/Sandra';
import Slider from '../components/Main/Arbeit/Slider';
import { blurHandler } from '../lib/blurHandler';
import { IBlurOutput } from '../components/Images/types';
import { getPlaiceholder } from 'plaiceholder';

interface IProps {
  images: IBlurOutput;
}

const Home: NextPage<IProps> = ({ images }) => {
  console.log('images', images.testimonialsSectionImages);

  return (
    <main className='mb-8'>
      <HeroSection heroSectionImages={images.heroSectionImages} />
      <AngebotSection />
      <SandraComponent sandraSectionImages={images.sandraSectionImages} />
      <Testimonials
        testimonialsSectionImages={images.testimonialsSectionImages}
      />
      <StudionSection />
      <Slider slideSectionImages={images.slideSectionImages} />
      {/* <ArbeitSection /> */}
      <BuchungsSection />
      <PartnerSection />
      <AnfahrtSection />
    </main>
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
