import React from 'react';

const CTA = () => {
  return (
    <div className='mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center'>
      <div className='mx-auto inline-grid grid-cols-2 gap-5'>
        <a
          href='#'
          className='ml-4 whitespace-nowrap inline-flex items-center justify-center w-28 h-12 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-700 hover:bg-indigo-700'
        >
          Buchung
        </a>
        <a
          href='#'
          className='flex items-center justify-center w-28 h-12  border border-indigo-700 text-base  font-medium rounded-md shadow-sm text-indigo-700 bg-white bg-opacity-60 hover:bg-opacity-70 sm:px-8'
        >
          Anfahrt
        </a>
      </div>
    </div>
  );
};
export default CTA;
