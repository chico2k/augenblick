import React from 'react';
import NextImage from 'next/image';

const LogoMobile = () => {
  return (
    <div
      className='absolute inset-0 flex justify-center h-full mt-4  z-20
  
        lg:hidden'
    >
      <div
        className='h-14 aspect-video relative 
              xs:h-16
              sm:h-24'
      >
        <NextImage
          layout='fill'
          src='/logo.png'
          alt='Augenblick Logo'
          className='block 
            lg:hidden'
        />
      </div>
    </div>
  );
};

export default LogoMobile;
