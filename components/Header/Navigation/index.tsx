import React from 'react';
import { Fragment } from 'react';
import {
  AnnotationIcon,
  ChatAlt2Icon,
  InboxIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import LogoHeader from './Logo';
import ButtonBuchung from './Button';
import MenuLinks from './Links';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import MenuMobil from './MenuMobil';
import MenuDesk from './MenuDesk';

const Navigation = () => {
  return (
    <header>
      <Disclosure as='nav' className='bg-white mb-2'>
        {({ open }) => (
          <>
            <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
              <div className='relative flex justify-between h-16'>
                <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                  {/* Mobile menu button */}
                  <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Open main menu</span>
                    {open ? (
                      <XIcon className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </Disclosure.Button>
                </div>
                <MenuDesk />
                <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                  <ButtonBuchung />
                </div>
              </div>
            </div>

            <MenuMobil />
          </>
        )}
      </Disclosure>
    </header>
  );
};

export default Navigation;
