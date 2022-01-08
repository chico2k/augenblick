import React from 'react';
import ContactInformation from '../Main/Buchung/Contact';
import Copyright from './Copyright';

const Footer = () => {
  return (
    <footer className='bg-indigo-700 text-white pt-20'>
      <div className='max-w-7xl mx-auto  px-4 overflow-hidden sm:px-6 lg:px-8'>
        <div className='pl-5 grid grid-cols-2 grid-rows-2'>
          <div>Buchung</div>
          <div>Datenschutz</div>
          <div>Angebot</div>
          <div>Impressum</div>
        </div>
        <div className='mt-16 pl-5 fill-gray-300 text-gray-300 '>
          <ContactInformation />
        </div>
        <div className='mt-16 '>
          <Copyright />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
