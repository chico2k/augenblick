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
    <>
      <div className='container px-5'>
        <h2 className='text-indigo-700 text-2xl'>Über mich</h2>
        <p className='py-14 text-base'>
          Ich bin zertifizierte Wimpernexpertin. Mit Liebe und Leidenschaft,
          möchte ich für meinen Kundinnen einen perfektes Ergenbnis zielen.
          <br />
          <br />
          <span className='text-indigo-700 font-light'> Sandra Rudic</span>
        </p>
      </div>

      <div className='w-full relative aspect-square'>
        <NextImage
          layout='fill'
          src='/sandra_about.jpg'
          objectFit='cover'
          placeholder='blur'
          blurDataURL={sandraSectionImages.sandra.base64}
        />
      </div>
    </>
  );
};
export default SandraComponent;
