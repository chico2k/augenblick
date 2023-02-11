import React from 'react';
import { Popover } from '@headlessui/react';

const navigation = [
  { name: 'Angebot', href: '#' },
  { name: 'Meine Arbeit', href: '#' },
  { name: 'Studio', href: '#' },
  { name: 'Partner', href: '#' },
  { name: 'Anfahrt', href: '#' },
];

const MenuLinks = () => {
  return (
    <Popover.Group as='nav' className='hidden md:flex space-x-10'>
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className='text-base font-medium text-gray-500 hover:text-gray-900'
        >
          {item.name}
        </a>
      ))}
    </Popover.Group>
  );
};

export default MenuLinks;
