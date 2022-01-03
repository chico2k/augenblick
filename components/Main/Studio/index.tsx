import React from 'react';

import NextImage from 'next/image';

const StudionSection = () => {
  return (
    <div className='mt-24'>
      <div className='text-center mb-10'>
        <h2 className='underline text-indigo-700 underline-offset-8 text-md leading-6 font-semibold  uppercase tracking-wider'>
          Das Studio
        </h2>
      </div>

      <div className='h-72 w-full relative'>
        <NextImage
          src='/studio.png'
          layout='fill'
          objectFit='cover'
          className='overflow-hidden'
        />
      </div>
      <div className='ml-4 mt-6'>
        <a href='https://www.google.com/maps/place/Augenblick+Chiemgau,+Carl-Orff-Stra%C3%9Fe+7,+83374+Traunreut/@47.942008,12.601627,14z/data=!4m2!3m1!1s0x477671d200d6f24f:0xd66571c4270f68c7?hl=DE&gl=DE'>
          <div className='flex'>
            <div className='pr-3 text-indigo-700 flex align-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 block m-auto'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </div>
            <div className='-mt-2'>
              <span className='font-medium'>Premiumcosmetic</span>
              <br />
              <span className='font-light'>
                Carl-Orff-Straße 7, 83374 Traunreut
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default StudionSection;
