import React from 'react';
import NextImage from 'next/image';
import {
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
} from '@heroicons/react/outline';
import imageEli from '/public/partner/eli.jpg';

const PartnerSection = () => {
  return (
    <div className='mx-auto max-w-7xl mt-36 md:grid md:grid-cols-2'>
      <div className='pr-16'>
        <h2 className='text-fuchsia-500 text-2xl mb-3 md:text-3xl xl:text-5xl'>
          Meine Partnerin
        </h2>
        <p className='text-base'>
          Inhaberin von Premiumcosmetic und langjährige gute Freundin,Elli
          Steffel.
        </p>

        <div className='text-gray-900 fill-gray-900'>
          <dl className='mt-8 space-y-3 text-xs'>
            <dd className='flex'>
              <svg
                className='flex-shrink-0 w-6 h-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z'
                ></path>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
                ></path>
              </svg>

              <span className='ml-3'>Carl-Orff-Straße 7, 83374 Traunreut</span>
            </dd>

            <dt>
              <span className='sr-only'>Email</span>
            </dt>
            <dd className='flex'>
              <svg
                className='flex-shrink-0 w-6 h-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z'
                ></path>
              </svg>

              <span className='ml-3'>info@premiumcosmetic.de</span>
            </dd>

            <dd className='flex'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                className='flex-shrink-0 w-6 h-6'
                aria-hidden='true'
              >
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'></path>
              </svg>
              <span className='ml-3'>premiumcosmetic_elli</span>
            </dd>
          </dl>
        </div>
      </div>
      <div className='overflow-hidden rounded-lg relative md:shadow-2xl md:shadow-gray-700/30'>
        <NextImage
          className='object-cover h-96 '
          src={imageEli}
          alt='Bild von Sandra Rudic'
          placeholder='blur'
        />
      </div>
    </div>
  );
};

export default PartnerSection;
