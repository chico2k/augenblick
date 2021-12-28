import React from 'react';
import NextImage from 'next/image';

const LogoHeader = () => {
  return (
    <div className='flex justify-start lg:w-0 lg:flex-1'>
      <a href='#'>
        <span className='sr-only'>Augenblick</span>
        <NextImage
          height='75'
          width='150'
          src='/logo.png'
          alt='Augenblick Logo'
        />
      </a>
    </div>
  );
};

export default LogoHeader;
