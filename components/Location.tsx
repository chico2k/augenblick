import React from 'react';

const StudioLocation = () => {
  return (
    <div className='ml-5 mt-4'>
      <a href='https://www.google.com/maps/place/Augenblick+Chiemgau,+Carl-Orff-Stra%C3%9Fe+7,+83374+Traunreut/@47.942008,12.601627,14z/data=!4m2!3m1!1s0x477671d200d6f24f:0xd66571c4270f68c7?hl=DE&gl=DE'>
        <div className='flex'>
          <div className='pr-3 text-indigo-700 flex align-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8 block m-auto'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </div>
          <div className='text-xs'>
            <span className='text-indigo-700'>Premiumcosmetic</span>
            <br />
            <span className='font-light'>
              Carl-Orff-Straße 7, 83374 Traunreut
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default StudioLocation;
