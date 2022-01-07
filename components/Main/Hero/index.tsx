import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import CTA from './CTA';
import { IHeroSection } from '../../Images/types';
import { Scroll } from './Scroll';
import HeaderSection from '../../Header';

interface IProps {
  heroSectionImages: IHeroSection;
}

const HeroSection: React.FC<IProps> = ({ heroSectionImages }) => {
  return (
    <>
      <section className='w-screen h-screen bg-white  grid grid-cols-2 relative'>
        <div className='absolute top-1/2 left-0 z-20 w-full -mt-4 '>
          <div className='pl-5 pt-12 font-bold text-indigo-700 text-4xl '>
            Dein Augenblick
          </div>
          <div className='pt-8 -mt-4 bg-indigo-100'></div>
          <div className='pl-5 text-lg '>
            Wimpernverlängerung <br />
            im Chiemgau
          </div>
          <div className='pl-5 mt-14 space-x-2 flex'>
            <div className='bg-indigo-700 px-4 h-10 w-32  flex justify-center items-center text-white rounded-lg'>
              Buchung
            </div>
            <div className='border solid border-indigo-700 px-4 h-10 w-32  flex justify-center items-center text-indigo-700 rounded-lg'>
              Anfahrt
            </div>
          </div>
        </div>

        <div className='relative flex h-72 min-h-48 self-center -mt-12 mr-6 '>
          <NextImage
            src='/hero_left.png'
            layout='fill'
            objectFit='cover'
            className='h-48 min-h-48 r object-fit object-right z-10'
          />
        </div>
        <div className='relative  '>
          <NextImage
            src='/hero_right.png'
            layout='fill'
            objectFit='cover'
            className='h-full object-cover object-left '
          />
        </div>
      </section>
    </>
  );
};

export default HeroSection;
