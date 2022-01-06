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
    // <div className='h-screen relative'>
    //   <div className='h-1/4 '>
    //     <h1 className='mt-32 mb-2 px-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl '>
    //       <span className='block text-gray-700 text-4xl'>
    //         Dein <br />
    //         <span className='text-6xl text-indigo-700 font-extrabold'>
    //           Augenblick
    //         </span>
    //       </span>
    //       <span className='block  text-gray-700 '>für die Wimpern</span>
    //     </h1>
    //   </div>
    //   <div className='absolut bottom-0 left-0 overflow-hidden align-middle'>
    //     <div className='relative'>
    //       <NextImage
    //         className='h-72 w-72 overflow-hidden'
    //         src={heroSectionImages.hero.url}
    //         alt='Sandra beim Wimpern machen'
    //         layout='fill'
    //         placeholder='blur'
    //         objectFit='cover'
    //         blurDataURL={heroSectionImages.hero.base64}
    //       />
    //     </div>
    //   </div>
    //   <div className=''>
    //     {/* <CTA /> */}
    //     <Scroll />
    //   </div>
    // </div>
    <>
      {/* <section className='top-banner-section'>
        <div className='banner-image-div relative'>
          <div className='absolute inset-0 w-full h-full bg-black banner-overlay-div '></div>

          <NextImage
            className='grid min-3xl h-full w-full object-cover relative'
            src={heroSectionImages.hero.url}
            alt='Sandra beim Wimpern machen'
            layout='fill'
            placeholder='blur'
            objectFit='cover'
            blurDataURL={heroSectionImages.hero.base64}
          />
        </div>
        <div className='text-indigo-700 grid items-center relative mr-10 ml-10 banner-text-div  '>
          <h1 className='mt-2 text-4xl'>
            Remain relevant in today's technology-driven economy
          </h1>
          <div>
            <a
              className='block text-xl font-extrabold bg-white rounded-xl mt-10 px-4 py-5'
              href='https://www.cambermast.com'
            >
              Get started &#8594;
            </a>
          </div>
        </div>
      </section> */}

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
