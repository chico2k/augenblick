import React from 'react';
import NextImage from 'next/image';
import {
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
} from '@heroicons/react/outline';

const PartnerSection = () => {
  return (
    <div
      className=' bg-white mx-auto max-w-7xl mt-36 
        md:container md:grid md:grid-cols-2
        '
    >
      <div className='mb-8 pl-5'>
        <h2
          className='text-indigo-700 text-2xl mb-3
          md:text-3xl md:mb-8
          xl:text-5xl 
        '
        >
          Meine Partnerin
        </h2>
        <p className='text-base'>
          Inhaberin von Premiumcosmetic und langjährige gute Freundin. Elli
          <br />
          <span className='block text-indigo-700 font-light italic mt-3'>
            Steffel, Kosmetikerin
          </span>
        </p>

        <div className='text-gray-900 fill-gray-900'>
          <dl className='mt-8 space-y-3 text-xs'>
            <dd className='flex '>
              <LocationMarkerIcon
                className='flex-shrink-0 w-4 h-4 '
                aria-hidden='true'
              />
              <span className='ml-3'>Carl-Orff-Straße 7, 83374 Traunreut</span>
            </dd>
            <dt>
              <span className='sr-only'>Phone number</span>
            </dt>
            <dd className='flex  '>
              <PhoneIcon
                className='flex-shrink-0 w-4 h-4 '
                aria-hidden='true'
              />
              <span className='ml-3'>+49 151 11 73 43 53 </span>
            </dd>
            <dt>
              <span className='sr-only'>Email</span>
            </dt>
            <dd className='flex  '>
              <MailIcon className='flex-shrink-0 w-4 h-4 ' aria-hidden='true' />
              <span className='ml-3'>info@premiumcosmetic.de</span>
            </dd>

            <dd className='flex  '>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                className='flex-shrink-0 w-4 h-4 '
                aria-hidden='true'
              >
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
              </svg>
              <span className='ml-3'>premiumcosmetic_elli</span>
            </dd>
          </dl>
        </div>
      </div>

      <div className='sm:grid sm:items-start sm:gap-6 sm:space-y-0'>
        <div
          className='w-full aspect-square relative
              md:shadow-2xl md:shadow-indigo-700/30
              lg:aspect-video
            '
        >
          <NextImage
            className='object-cover'
            src='/eli.jpg'
            alt='Bild von Sandra Rudic'
            objectFit='cover'
            layout='fill'
            // placeholder='blur'
            // blurDataURL={sandraSectionImages.sandra.base64}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerSection;
