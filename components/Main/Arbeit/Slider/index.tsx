import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import NextImage from 'next/image';
import { ISlideSection } from '../../../Images/types';

interface IProps {
  slideSectionImages: ISlideSection;
}

const Slider: React.FC<IProps> = ({ slideSectionImages }) => {
  const [ref] = useKeenSlider<HTMLDivElement>({
    loop: true,
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
      <div className='mb-10 '>
        <div className='text-center mb-8'>
          <h2 className='underline text-indigo-700 underline-offset-8 text-md leading-6 font-semibold  uppercase tracking-wider'>
            Impressionen
          </h2>
        </div>
      </div>
      <div ref={ref} className='keen-slider'>
        {imagesList}
      </div>
    </>
  );
};

export default Slider;
