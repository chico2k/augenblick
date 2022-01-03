import React from 'react';
import { useSpring, animated } from 'react-spring';

export const Scroll = () => {
  const styles = useSpring({
    loop: true,
    from: { y: 0, opacity: 1, scale: 0.8 },
    to: async (next) => {
      await next({ y: 8, opacity: 0.8, scale: 1 });
      await next({ y: 0, opacity: 1, scale: 0.8 });
    },
    config: { duration: 800 },
  });

  return (
    <animated.div className='flex h-full justify-center align-bottom relative'>
      <div className='absolute bottom-16 text-indigo-700'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 17l-4 4m0 0l-4-4m4 4V3'
          />
        </svg>
      </div>
    </animated.div>
  );
};
