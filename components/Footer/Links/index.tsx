import React from 'react';
import Link from 'next/link';

const links = [
  { name: 'Buchung', href: '#' },
  { name: 'Impressum', href: '#' },
  { name: 'Datenschutz', href: '/datenschutz' },
];

const FooterLinks = () => {
  return (
    <nav
      className='-mx-5 -my-2 flex flex-wrap justify-center'
      aria-label='Footer'
    >
      {links.map((item) => (
        <Link href={item.href} key={item.name} passHref>
          <div key={item.name} className='px-5 py-2'>
            <a
              href={item.href}
              className='text-base text-gray-500 hover:text-gray-900'
            >
              {item.name}
            </a>
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default FooterLinks;
