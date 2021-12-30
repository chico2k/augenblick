import React, { useState } from 'react';
import NextImage from 'next/image';
import 'keen-slider/keen-slider.min.css';

const images = ['/work/1.jpg', '/work/2.jpg', '/work/3.jpg'];

const ArbeitSection = () => {
  return (
    /**
     * Remove First Div
     */
    <div className='mt-20 mb-20'>
      <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
        <h3>Gallery</h3>
        <div className='grid gird-cols-1'>
          <div className='w-full  aspect-square  bg-red-200 relative '>
            IMAGE 1
            {/* <NextImage
              src='/work/1.jpg'
              layout='fill'
              objectFit='cover'
              className='rounded-xl'
            /> */}
          </div>
          <div className='w-full  aspect-square bg-red-300 relative '>
            IMAGE 2
            {/* <NextImage
              src='/work/2.jpg'
              layout='fill'
              objectFit='cover'
              className='rounded-xl'
            /> */}
          </div>
          <div className='w-full  aspect-square bg-red-300 relative '>
            IMAGE 3
            {/* <NextImage
              src='/work/4.jpg'
              layout='fill'
              objectFit='cover'
              className='rounded-xl'
            /> */}
          </div>
          <div className='w-full  aspect-square bg-red-300 relative '>
            <span>IMAGE 4</span>
            {/* <NextImage
                src='/work/3.jpg'
                layout='fill'
                objectFit='cover'
                className='rounded-xl'
              /> */}
          </div>
          <div className='w-full  aspect-square bg-red-300 relative   '>
            IMAGE 5
            {/* <NextImage
                src='/work/5.jpg'
                layout='fill'
                objectFit='cover'
                className='rounded-xl'
              /> */}
          </div>
          <div className='w-full  aspect-square bg-red-400'>HALLO 1</div>
          <div className='w-full  aspect-square bg-red-500'>HALLO 2</div>
          <div className='w-full  aspect-square bg-red-600 relative '>
            HALLO 3
          </div>
          <div className='w-full  aspect-square bg-red-700 '>HALLO 4</div>
        </div>
      </div>
    </div>
  );
};

export default ArbeitSection;
