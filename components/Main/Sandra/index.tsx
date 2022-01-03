import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { ISandraSection } from '../../Images/types';

const people = {
  twitterUrl: '#',
  linkedinUrl: '#',
};

interface IProps {
  sandraSectionImages: ISandraSection;
}

const SandraComponent: React.FC<IProps> = ({ sandraSectionImages }) => {
  return (
    <div className='bg-white'>
      <div className='text-center mb-12'>
        <h2 className='underline text-indigo-700 underline-offset-8 text-md leading-6 font-semibold  uppercase tracking-wider'>
          Über mich
        </h2>
      </div>
      <div className='mx-auto px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24 '>
        <div className='space-y-12 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0'>
          <div className='space-y-5 sm:space-y-4 easyIn'>
            <p className='text-lg text-black'>
              Ich bin zertifizierte Wimpernexpertin. Mit Liebe und Leidenschaft,
              möchte ich für meinen Kundeinnen einen perfektes Ergenbnis zielen.
            </p>

            <div className='lg:col-span-1'>
              <ul
                role='list'
                className='space-y-12 sm:divide-y sm:divide-gray-200 sm:space-y-0 sm:-mt-8 lg:gap-x-8 lg:space-y-0'
              >
                <li className='sm:py-8'>
                  <div className='space-y-4 sm:grid sm:items-start sm:gap-6 sm:space-y-0'>
                    <div className='w-full h-96 relative '>
                      <NextImage
                        className='object-cover shadow-lg rounded-lg overflow-hidden'
                        src='/sandra_about.jpg'
                        alt='Bild von Sandra Rudic'
                        objectFit='cover'
                        layout='fill'
                        placeholder='blur'
                        blurDataURL={sandraSectionImages.sandra.base64}
                      />
                    </div>
                  </div>
                </li>
              </ul>
              <div className='pt-4'>
                <h3>
                  <span className='text-4xl font-bold'> Sandra Rudic</span>
                  <br />
                  <span className='text-2xl text-indigo-700'>
                    Lash Expertin
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SandraComponent;
