import React from 'react';
import ContactInformation from '../Main/Buchung/Contact';
import Copyright from './Copyright';

const Footer = () => {
  return (
    <footer className='bg-indigo-700 text-white pt-20'>
      <div className='max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8'>
        <div className='pl-5 grid grid-cols-2 grid-rows-2'>
          <div>Buchung</div>
          <div>Datenschutz</div>
          <div>Angebot</div>
          <div>Impressum</div>
        </div>

        <ContactInformation color={'white'} />
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
