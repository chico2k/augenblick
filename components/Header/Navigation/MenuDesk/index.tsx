import React, { useEffect, useState } from 'react';
import { navigationLinks } from '../links';
import NextImage from 'next/image';
import { Link } from 'react-scroll';

const MenuDesk = () => {
  const links = navigationLinks.map((link) => {
    return (
      <div key={link.name}>
        <Link to={link.href} spy={true} smooth={true} duration={500}>
          <a
            href={link.href}
            className='
        border-transparent text-fuchsia-900 px-1 pt-2 text-sm  block uppercase
        hover:text-fuchsia-400
        lg:text-sm lg:tracking-tight
        xl:text-base
        2xl:text-lg
        '
          >
            <span>{link.name} </span>
          </a>
        </Link>
      </div>
    );
  });

  return (
    <div
      className={`flex-1 flex  container
    lg:items-stretch md:justify-start`}
    >
      <div
        className='hidden 
        lg:block  aspect-video w-28  relative 
      '
      >
        <NextImage
          layout='fill'
          src='/logo_black.png'
          alt='Augenblick Logo'
          className='hidden lg:block'
        />
      </div>
      <div
        className='hidden 
        lg:ml-6 lg:flex lg:space-x-2  justify-center items-center
      '
      >
        {links}
      </div>
    </div>
  );
};

export default MenuDesk;
