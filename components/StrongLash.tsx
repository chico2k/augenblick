import React from 'react';
import NextImage from 'next/future/image';
import lash from '/public/stronglash/quote.png';

const StrongLash = () => {
  return (
    <div className='container  h-[700px] lax__strong_lash'>
      <NextImage
        alt='Strong Lashes'
        src={lash}
        placeholder='blur'
        className='w-full h-full object-contain object-position-bottom '
      />
    </div>
  );
};

export default StrongLash;
