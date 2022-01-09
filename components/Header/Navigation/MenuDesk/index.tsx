import React from 'react';
import { navigationLinks } from '../links';
import NextImage from 'next/image';

const MenuDesk = () => {
  const links = navigationLinks.map((link) => {
    return (
      <a
        href={link.href}
        key={link.name}
        className='
        border-transparent text-gray-500 hover:border-gray-300 px-1 pt-2 border-b-2 text-sm tracking-tighter block uppercase
        hover:text-gray-700 
        lg:text-sm lg:tracking-tight
        xl:text-base
        2xl:text-lg
        '
      >
        {link.name}
      </a>
    );
  });

  return (
    <div
      className='flex-1 flex  container
    lg:items-stretch md:justify-start'
    >
      <div
        className='hidden lg:block  aspect-video w-28 relative 
      '
      >
        <NextImage
          layout='fill'
          src='/logo.png'
          alt='Augenblick Logo'
          className='hidden lg:block'
        />
      </div>
      <div
        className='hidden 
        lg:ml-4 lg:flex lg:space-x-3  justify-center items-center
      '
      >
        {links}
      </div>
    </div>
  );
};

export default MenuDesk;
