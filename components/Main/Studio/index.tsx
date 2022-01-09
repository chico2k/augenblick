import React from 'react';

import NextImage from 'next/image';

const StudionSection = () => {
  return (
    <div className='mt-36 relative'>
      <div
        className='h-64 w-full relative aspect-video
        object-right-bottom
        sm:h-2/3
        lg:h-screen
    '
      >
        <div
          className='absolute inset-0 pl-5 pt-5 z-10 
     
          md:pl-5 md:pt-5
          lg:pl-16 lg:pt-16 lg:text-9xl 
        '
        >
          <div
            className='text-white text-3xl 
          md:text-4xl '
          >
            <h2
              className='tex-inherit
              mb-4'
            >
              Das Studio
            </h2>
            <span>Atemberaubende Atomosphäre</span>
          </div>
        </div>

        <NextImage
          src='/studio.png'
          layout='fill'
          objectFit='cover'
          className='overflow-hidden object-bottom-right'
        />
      </div>
    </div>
  );
};

export default StudionSection;
