import React from 'react';

const CTA = () => {
  return (
    <div className='mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center'>
      <div className='space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5'>
        <a
          href='#'
          className='flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8'
        >
          Buchung
        </a>
        <a
          href='#'
          className='flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8'
        >
          Anfahrt
        </a>
      </div>
    </div>
  );
};
export default CTA;
