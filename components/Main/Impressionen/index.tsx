import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import NextImage from 'next/image';
import { ISlideSection } from '../../Images/types';
import SliderArrow from './Arrow';

interface IProps {
  slideSectionImages: ISlideSection;
}

function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}) {
  const disabeld = props.disabled ? ' arrow--disabled' : '';
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? 'arrow--left' : 'arrow--right'
      } ${disabeld}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      {props.left && (
        <path d='M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z' />
      )}
      {!props.left && (
        <path d='M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z' />
      )}
    </svg>
  );
}

const Slider: React.FC<IProps> = ({ slideSectionImages }) => {
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

  const imagesList = slideSectionImages.map((image) => {
    return (
      <div
        className='keen-slider__slide  h-full aspect-square bg-white '
        key={image.id}
      >
        <NextImage
          src={image.url}
          blurDataURL={image.base64}
          layout='fill'
          objectFit='cover'
          placeholder='blur'
        />
      </div>
    );
  });

  return (
    <>
      <div
        className='mt-36
        md:container md:px-8'
      >
        <h2
          className='text-indigo-700 text-2xl mb-8 pl-5
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
              <SliderArrow
                left
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.prev()
                }
                disabled={currentSlide === 0}
              />

              <SliderArrow
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.next()
                }
                disabled={
                  currentSlide ===
                  instanceRef.current.track.details.slides.length - 1
                }
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Slider;
