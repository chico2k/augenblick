import React from 'react';
import Image from 'next/future/image';
import imageHero from '/public/IMG_0106_test.png';
import { Link } from 'react-scroll';

const HeroSection: React.FunctionComponent = () => {
  return (
    <section className='flex items-center h-screen relative overflow-hidden'>
      <div className='bg-white opacity-70 z-30 absolute inset-0'></div>
      <Image
        alt='Test'
        src={imageHero}
        className='object-cover absolute inset-0 h-screen'
      />
      <div className='w-full max-w-7xl mx-auto container z-40'>
        <div className='relative pl-5 font-bold text-fuchsia-500 text-5xl tracking-tight z-10 xs:text-6xl sm:tracking-normal sm:text-7xl sm:comtainer md:text-8xl'>
          Dein
        </div>
        <h1 className='pl-5 font-bold text-fuchsia-500 text-5xl tracking-tight z-20 xs:text-6xl sm:tracking-normal sm:text-7xl md:text-8xl'>
          Augenblick
        </h1>

        <div className='mt-6 text-lg pl-5 sm:text-2xl lg:text-2xl uppercase text-gray-900'>
          Wimpernverlängerung im Chiemgau.
        </div>
        <div className='ml-5 mt-12 space-x-2 flex lg:text-xl lg:space-x-6'>
          <a>
            <div className='cursor-pointer bg-fuchsia-500 px-8 py-2 flex justify-center items-center text-white rounded-lg hover:bg-fuchsia-800'>
              <span>Buchung</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
