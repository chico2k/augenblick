import React from 'react';

import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

interface IProps {
  open: boolean;
}

const MobileMenuButton: React.FC<IProps> = ({ open }) => {
  return (
    <Disclosure.Button
      className='inline-flex items-center justify-center rounded-md text-gray-400  z-40
        hover:text-gray-500 hover:bg-gray-100 
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500
        lg:hidden
          '
    >
      <span className='sr-only'>Open main menu</span>
      {open ? (
        <XIcon className='block h-10 w-10' aria-hidden='true' />
      ) : (
        <MenuIcon className='block h-10 w-10' aria-hidden='true' />
      )}
    </Disclosure.Button>
  );
};

export default MobileMenuButton;
