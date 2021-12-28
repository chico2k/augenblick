import React from 'react';
import NextImage from 'next/image';

const HeroSection = () => {
  return (
    <div className='relative'>
      <div className='absolute inset-x-0 bottom-0 h-full bg-gray-100' />
      <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
        <div className='relative shadow-xl sm:rounded-2xl sm:overflow-hidden'>
          <div className='absolute inset-0'>
            <NextImage
              className='h-full w-full object-cover'
              src='/hero.jpg'
              alt='People working on laptops'
              layout='fill'
            />
            <div className='absolute inset-0 bg-gray-400 mix-blend-multiply' />
          </div>
          <div className='relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8'>
            <h1 className='text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl'>
              <span className='block text-white'>Dein Augenblick</span>
              <span className='block text-indigo-200'>für deine Wimpern</span>
            </h1>
            <p className='mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl'>
              Wimpern Styling und Verlängerung in atemberaubender Atmosphäre.
            </p>
            <div className='mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center'>
              <div className='space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5'>
                <a
                  href='#'
                  className='flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8'
                >
                  Buchung
                </a>
                <a
                  href='#'
                  className='flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8'
                >
                  Anfahrt
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
