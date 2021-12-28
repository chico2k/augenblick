import React from 'react';
import { Fragment } from 'react';
import {
  AnnotationIcon,
  ChatAlt2Icon,
  InboxIcon,
  MenuIcon,
  QuestionMarkCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import LogoHeader from './Logo';
import ButtonBuchung from './Button';
import MenuLinks from './Links';

const Navigation = () => {
  return (
    <header>
      <Popover className='relative bg-white'>
        <div className='flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8'>
          <LogoHeader />

          <MenuLinks />
          <ButtonBuchung />
        </div>
      </Popover>
    </header>
  );
};

export default Navigation;
