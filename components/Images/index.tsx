import {
  IBlurOutput,
  IHeroSection,
  ISandraSection,
  ISlideSection,
  ITestimonialsSection,
} from './types';

export const heroSectionImages: IHeroSection = {
  hero: {
    id: 1,
    url: '/hero.jpg',
    base64: '',
  },
};

export const sandraSectionImages: ISandraSection = {
  sandra: {
    id: 1,
    url: '/hero.jpg',
    base64: '',
  },
};

export const slideSectionImages: ISlideSection = [
  { id: 1, url: '/work/1.jpg', base64: '' },
  { id: 2, url: '/work/2.jpg', base64: '' },
  { id: 3, url: '/work/3.jpg', base64: '' },
  { id: 5, url: '/work/4.jpg', base64: '' },
  { id: 5, url: '/work/5.jpg', base64: '' },
  { id: 6, url: '/work/6.jpg', base64: '' },
];

const testimonialsSectionImages: ITestimonialsSection = {
  number1: {
    id: 1,
    url: '/testimonial_1.jpg',
    base64: '',
  },
  number2: {
    id: 2,
    url: '/testimonial_2.jpg',
    base64: '',
  },
};

export const sectionImages: IBlurOutput = {
  heroSectionImages,
  sandraSectionImages,
  slideSectionImages,
  testimonialsSectionImages,
};
