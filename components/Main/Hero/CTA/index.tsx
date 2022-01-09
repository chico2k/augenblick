import React from 'react';

const CTA = () => {
  return (
    <div
      className='
      ml-5 mt-14 space-x-2 flex
      lg:text-xl lg:space-x-6'
    >
      <div
        className='
      bg-indigo-700  h-10 w-28  flex justify-center items-center text-white rounded-lg
        lg:w-36 lg:h-12
    '
      >
        Buchung
      </div>
      <div
        className='
        border solid border-indigo-700 h-10 w-28  flex justify-center items-center text-indigo-700 rounded-lg
        lg:w-36 lg:h-12
    '
      >
        Anfahrt
      </div>
    </div>
  );
};
export default CTA;
