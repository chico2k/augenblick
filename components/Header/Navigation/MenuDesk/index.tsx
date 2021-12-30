import React from 'react';
import { navigationLinks } from '../links';
import NextImage from 'next/image';

const MenuDesk = () => {
  const links = navigationLinks.map((link) => {
    return (
      <a
        key={link.name}
        href={link.href}
        className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
      >
        {link.name}
      </a>
    );
  });

  return (
    <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
      <div className='flex-shrink-0 flex items-center'>
        {/* <img
          className='block lg:hidden h-8 w-auto'
          src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
          alt='Workflow'
        />
        <img
          className='hidden lg:block h-8 w-auto'
          src='https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg'
          alt='Workflow'
        /> */}

        <div className='block lg:hidden h-12 w-24 relative'>
          <NextImage
            layout='fill'
            src='/logo.png'
            alt='Augenblick Logo'
            className='block lg:hidden'
          />
        </div>
        <div className='hidden lg:block h-12 w-24 relative'>
          <NextImage
            layout='fill'
            src='/logo.png'
            alt='Augenblick Logo'
            className='hidden lg:block'
          />
        </div>
      </div>
      <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
        {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
        {links}
      </div>
    </div>
  );
};

export default MenuDesk;
