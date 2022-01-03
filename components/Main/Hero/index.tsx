import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import CTA from './CTA';
import { IHeroSection } from '../../Images/types';
import { Scroll } from './Scroll';

interface IProps {
  heroSectionImages: IHeroSection;
}

const HeroSection: React.FC<IProps> = ({ heroSectionImages }) => {
  return (
    <div className='h-screen'>
      <div className='h-1/4 '>
        <h1 className='mt-32 mb-2 px-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl '>
          <span className='block text-gray-700 text-4xl'>
            Dein <br />
            <span className='text-6xl text-indigo-700 font-extrabold'>
              Augenblick
            </span>
          </span>
          <span className='block  text-gray-700 '>für die Wimpern</span>
        </h1>
      </div>
      <div className='relative h-2/6 overflow-hidden align-middle'>
        <NextImage
          className='h-full w-full overflow-hidden'
          src={heroSectionImages.hero.url}
          alt='Sandra beim Wimpern machen'
          layout='fill'
          placeholder='blur'
          objectFit='cover'
          blurDataURL={heroSectionImages.hero.base64}
        />
      </div>
      <div className='h-1/6'>
        <CTA />
        <Scroll />
      </div>
    </div>
  );
};

export default HeroSection;
