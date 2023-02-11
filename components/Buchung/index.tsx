import BuchungsForm from './Form';
import { Element } from 'react-scroll';

const BuchungsSection = () => {
  return (
    <Element name='buchung'>
      <div
        className=' bg-white relative max-w-7xl   mx-auto mt-36  
      sm:py-24 
       lg:pb-18'
      >
        <h2 className='pl-5 bg-fuchsia-500 text-white text-3xl py-7'>
          Buchung
        </h2>
        <h2 className='sr-only'>Buchung</h2>

        <div
          className='
            bg-gray-100 pl-5 
     '
        >
          <BuchungsForm />

          <div
            className='
            fill-gray-900 text-gray-900 first-line:pt-8 pl-7 mb-8 mt-8 '
          ></div>
        </div>
      </div>
    </Element>
  );
};

export default BuchungsSection;
