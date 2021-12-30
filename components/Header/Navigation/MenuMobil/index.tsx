import React from 'react';
import { Disclosure } from '@headlessui/react';
import { navigationLinks } from '../links';

const MenuMobil = () => {
  const links = navigationLinks.map((link) => {
    return (
      <Disclosure.Button
        key={link.name}
        as='a'
        href={link.href}
        className='border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
      >
        {link.name}
      </Disclosure.Button>
    );
  });

  return (
    <Disclosure.Panel className='sm:hidden'>
      <div className='pt-2 pb-4 space-y-1'>
        {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
        {links}
      </div>
    </Disclosure.Panel>
  );
};

export default MenuMobil;
