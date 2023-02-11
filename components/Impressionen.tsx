import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import NextImage from 'next/future/image';
import { Element } from 'react-scroll';

import image_1 from '/public/work/1.jpg';
import image_2 from '/public/work/2.jpg';
import image_3 from '/public/work/3.jpg';
import image_4 from '/public/work/4.jpg';
import image_5 from '/public/work/5.jpg';
import image_6 from '/public/work/6.jpg';

const imageList = [
  { image: image_1, alt: 'image 1' },
  { image: image_2, alt: 'image 2' },
  { image: image_3, alt: 'image 3' },
  { image: image_4, alt: 'image 4' },
  { image: image_5, alt: 'image 5' },
  { image: image_6, alt: 'image 6' },
];

const Slider: React.FunctionComponent = () => {
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 5 },
      },
      '(min-width: 768px)': {
        slides: { perView: 3, spacing: 10 },
      },
      '(min-width: 1000px)': {
        slides: { perView: 4, spacing: 15 },
      },
    },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
    slides: {
      perView: 1,
      spacing: 15,
    },
  });

  const imagesList = imageList.map((image, indeex) => {
    return (
      <div
        className='keen-slider__slide  h-full aspect-square bg-white '
        key={indeex}
      >
        <NextImage
          src={image.image}
          placeholder='blur'
          alt={image.alt}
          className='object-fill hover:scale-105 transition-all'
        />
      </div>
    );
  });

  return (
    <div className=''>
      <Element name='impressionen'>
        <div id='impressionen' className='mt-24 '>
          <h2
            className='text-indigo-700 text-2xl mb-8 pl-5 sr-only
              md:text-3xl md:pl-0
              xl:text-5xl xl:mb-16
              '
          >
            Impressionen
          </h2>

          <div ref={sliderRef} className='keen-slider relative z-10'>
            {imagesList}
            {loaded && instanceRef.current && (
              <>
                <svg
                  onClick={(e: any) =>
                    e.stopPropagation() || instanceRef.current?.prev()
                  }
                  className={`w-14 h-14 p-3 bg-fuchsia-500 rounded-full absolute top-1/2 hover:bg-fuchsia-600 hover:scale-110 transition-all cursor-pointer fill-white -mt-7 left-5`}
                  //   className={`arrow ${left ? 'arrow--left' : 'arrow--right'} ${disabeld}`}
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path d='M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z' />
                </svg>
                <svg
                  onClick={(e: any) =>
                    e.stopPropagation() || instanceRef.current?.next()
                  }
                  className={`w-14 h-14 p-3 bg-fuchsia-500 rounded-full absolute top-1/2 hover:bg-fuchsia-600 hover:scale-110 transition-all cursor-pointer fill-white -mt-7 right-5`}
                  //   className={`arrow ${left ? 'arrow--left' : 'arrow--right'} ${disabeld}`}
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path d='M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z' />
                </svg>
              </>
            )}
          </div>
        </div>
      </Element>
    </div>
  );
};

export default Slider;
