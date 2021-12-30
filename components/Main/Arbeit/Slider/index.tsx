import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import NextImage from 'next/image';
import { ISlideSection } from '../../../Images/types';

const images = [
  {
    id: 1,
    url: '/work/1.jpg',
    blur: '/work/1.jpg',
  },
  {
    id: 2,
    url: '/work/2.jpg',
    blur: '/work/2.jpg',
  },
  {
    id: 3,
    url: '/work/3.jpg',
    blur: '/work/3.jpg',
  },

  {
    id: 4,
    url: '/work/4.jpg',
    blur: '/work/4.jpg',
  },
  {
    id: 5,
    url: '/work/5.jpg',
    blur: '/work/5.jpg',
  },
  {
    id: 6,
    url: '/work/6.jpg',
    blur: '/work/6.jpg',
  },
];

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
      <h1>Gallery</h1>
      <div ref={ref} className='keen-slider'>
        {imagesList}
      </div>
    </>
  );
};

export default Slider;
