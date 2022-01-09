import React from 'react';
import CTA from '../CTA';

const HeroContent = () => {
  return (
    <div
      className='flex items-center z-40 h-full w-full 
      sm:container'
    >
      <div className='w-full'>
        <div
          className='             
              pl-5 pt-28 font-bold text-indigo-700 text-5xl tracking-tight
              xs:text-6xl
              sm:tracking-normal sm:text-7xl
              md:text-8xl 
              lg:text-9xl
          '
        >
          Dein <br /> Augenblick
        </div>
        <div
          className='
              pt-8 -mt-6 bg-indigo-100  w-full shadow-2xl shadow-indigo-500/20
              sm:pt-10 sm:-mt-8 sm:max-w-lg sm:mx-2
              md:pt-12 md:-mt-10 md:max-w-2xl md:rounded 
              lg:max-w-4xl  lg:pt-16 lg:-mt-14
          '
        ></div>
        <div
          className='mt-2 text-lg pl-5
              sm:text-2xl
              lg:text-3x
              '
        >
          Wimpernverlängerung im Chiemgau
        </div>
        <CTA />
      </div>
    </div>
  );
};

export default HeroContent;
