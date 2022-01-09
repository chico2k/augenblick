import React from 'react';
import { Disclosure } from '@headlessui/react';
import MenuMobil from './MenuMobil';
import MenuDesk from './MenuDesk';
import LogoMobile from './LogoMobile';
import MobileMenuButton from './ButtonMobile';

const Navigation = () => {
  return (
    <header className='absolute inset-0'>
      <Disclosure as='nav' className='mb-2 z-10'>
        {({ open }) => {
          return (
            <>
              <div
                className='mx-auto mt-4 ml-5 pl-5
                sm:container sm:mt-10'
              >
                <div className='flex justify-between'>
                  <MobileMenuButton open={open} />
                  <LogoMobile />
                  <MenuDesk />
                </div>
                <MenuMobil />
              </div>
            </>
          );
        }}
      </Disclosure>
    </header>
  );
};

export default Navigation;
