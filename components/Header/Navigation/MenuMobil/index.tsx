import React from 'react';
import { Disclosure } from '@headlessui/react';
import { navigationLinks } from '../links';
import { useSpring, animated } from 'react-spring';

interface IProps {
  open: boolean;
}

const MenuMobil: React.FC<IProps> = ({ open }) => {
  const styles = useSpring({
    to: { opacity: open ? 1 : 0, x: open ? 0 : 100 },
    from: { opacity: 0, x: 0 },
  });

  const styles2 = useSpring({
    to: { opacity: open ? 1 : 0 },
    from: { opacity: 0 },
  });

  const links = navigationLinks.map((link) => {
    return (
      <Disclosure.Button
        key={link.name}
        as='a'
        href={link.href}
        className='border-transparent text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
      >
        <animated.div style={styles}>{link.name}</animated.div>
      </Disclosure.Button>
    );
  });

  return (
    <animated.div style={styles2}>
      <Disclosure.Panel
        className='
        fixed inset-0 h-screen w-full z-30
        flex justify-center items-center
        bg-indigo-700
        lg:hidden'
      >
        <div className='pt-2 pb-4 space-y-2'>{links}</div>
      </Disclosure.Panel>
    </animated.div>
  );
};

export default MenuMobil;
