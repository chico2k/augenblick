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
      '(min-width: 400px)': {
        slides: { perView: 2, spacing: 5 },
      },
      '(min-width: 1000px)': {
        slides: { perView: 3, spacing: 10 },
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
      <div className='keen-slider__slide  h-96 bg-white' key={image.id}>
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
      <div className='mb-10 mt-32'>
        <div className='text-center mb-8'>
          <h2 className='underline text-indigo-700 underline-offset-8 text-md leading-6 font-semibold  uppercase tracking-wider'>
            Impressionen
          </h2>
        </div>
      </div>
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
    </>
  );
};

export default Slider;
