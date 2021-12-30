import React from 'react';
import NextImage from 'next/image';
import CTA from './CTA';
import { IHeroSection } from '../../Images/types';
interface IProps {
  heroSectionImages: IHeroSection;
}

const HeroSection: React.FC<IProps> = ({ heroSectionImages }) => {
  return (
    <div className='relative'>
      <div className='mx-auto'>
        <div className='relative'>
          <div className='absolute inset-0'>
            <NextImage
              className='h-full w-full object-cover'
              src={heroSectionImages.hero.url}
              alt='Sandra beim Wimpern machen'
              layout='fill'
              placeholder='blur'
              blurDataURL={heroSectionImages.hero.base64}
            />
            <div className='absolute inset-0 bg-gray-600 mix-blend-multiply' />
          </div>
          <div className='relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8'>
            <h1 className='text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl'>
              <span className='block text-white '>Dein Augenblick</span>
              <span className='block text-indigo-200 '>für deine Wimpern</span>
            </h1>
            <p className='mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl'>
              Styling und Verlängerungen von Wimpern in atemberaubender
              Atmosphäre.
            </p>
            <CTA />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
