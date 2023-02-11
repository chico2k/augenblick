import { Disclosure } from '@headlessui/react';
import MenuMobil from './MenuMobil';
import MenuDesk from './MenuDesk';
import LogoMobile from './LogoMobile';
import MobileMenuButton from './ButtonMobile';
import useScrollListener from '../../../lib/Hooks';

const Navigation = () => {
  return (
    <header className='absolute inset-x-0 z-50'>
      <Disclosure as='nav' className='mb-2 max-w-7xl mx-auto'>
        {({ open }) => {
          return (
            <>
              <div
                className='mx-auto mt-4 pl-5
                sm:container sm:mt-10'
              >
                <div className='flex justify-between'>
                  <MobileMenuButton open={open} />
                  <LogoMobile open={open} />
                  <MenuDesk />
                </div>
                <MenuMobil open={open} />
              </div>
            </>
          );
        }}
      </Disclosure>
    </header>
  );
};

export default Navigation;
