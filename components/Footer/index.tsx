import React from 'react';
import Copyright from './Copyright';
import FooterLinks from './Links';
import FooterSocial from './Social';

const Footer = () => {
  return (
    <footer className='bg-white'>
      <div className='max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8'>
        <FooterLinks />
        <FooterSocial />
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
