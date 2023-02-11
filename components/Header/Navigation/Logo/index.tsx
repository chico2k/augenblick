import React from 'react';
import NextImage from 'next/image';

const LogoHeader = () => {
  return (
    <div className='flex justify-start lg:w-0 lg:flex-1'>
      <a href='#'>
        <span className='sr-only'>Augenblick</span>
        <div className='h-10 w-20 relative '>
          <NextImage layout='fill' src='/logo.png' alt='Augenblick Logo' />
        </div>
      </a>
    </div>
  );
};

export default LogoHeader;
