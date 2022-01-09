import React from 'react';
import NextImage from 'next/image';

const BackgroundImage = () => {
  return (
    <div className='absolute inset-0 flex justify-end -z-10'>
      <div
        className='h-full w-3/5 max-w-xs relative 
          sm:w-2/5 
          xl:max-w-lg
          '
      >
        <NextImage
          src='/hero_right.png'
          layout='fill'
          objectFit='cover'
          className='h-full object-cover object-left '
        />
      </div>
    </div>
  );
};

export default BackgroundImage;
