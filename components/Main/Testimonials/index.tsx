import React from 'react';
import NextImage from 'next/image';
import { ITestimonialsSection } from '../../Images/types';
import { useKeenSlider } from 'keen-slider/react';
import { reviewList } from './reviews';
import Stars from './Stars';

interface IProps {
  testimonialsSectionImages: ITestimonialsSection;
}

const Testimonials: React.FC<IProps> = ({ testimonialsSectionImages }) => {
  const [ref] = useKeenSlider<HTMLDivElement>({
    loop: true,
  });

  const reviewListItems = reviewList.map((review) => {
    return (
      <div className='keen-slider__slide  h-96 bg-white' key={review.id}>
        <div className='p-10'>
          <div>
            {review.name} <Stars />
          </div>
          <br />
          <div>{review.text} </div>
          <div></div>
          <br />
        </div>
      </div>
    );
  });

  return (
    <div className='container text-center mb-8 mx-auto sm:px-12 lg:px-16'>
      <div className='text-center mb-8'>
        <h2 className='underline text-indigo-700 underline-offset-8 text-md leading-6 font-semibold  uppercase tracking-wider'>
          Kundenmeinungen
        </h2>
      </div>
      <div className='bg-gradient-to-tr from-indigo-400 via-indigo-500 to-indigo-700 pb-0 relative'>
        <div className='grid grid-cols-1 relative sm:grid sm:grid-cols-2'>
          <div className='w-full aspect-square shadow-xl overflow-hidden relative self-center'>
            <div className='absolute left-3 top-3  font-medium text-sm rounded-xl w-40  h-8 bg-yellow-400 z-10 flex justify-center '>
              <span className='self-center'> Wimpern Verlängerung</span>
            </div>
            <NextImage
              className='overflow-hidden '
              src={testimonialsSectionImages.number1.url}
              alt='Testimonial'
              layout='fill'
              objectFit='cover'
              placeholder='blur'
              blurDataURL={testimonialsSectionImages.number1.base64}
            />
          </div>
          <div className='my-6 lg:m-0 lg:col-span-1 lg:pl-8'>
            <div className='mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:py-20 lg:max-w-none'>
              <blockquote>
                <div>
                  <div className='flex justify-between pr-4'>
                    <div className='w-8 h-8 '>
                      <svg
                        className='h-full w-full text-white opacity-25'
                        fill='currentColor'
                        viewBox='0 0 32 32'
                        aria-hidden='true'
                      >
                        <path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
                      </svg>
                    </div>
                    <div className='text-yellow-400 '>
                      <Stars />
                    </div>
                  </div>
                  <p className='mt-6 text-md font-normal text-white'>
                    Es war richtig cool. Mein erstes Mal Wimpern Lifting und
                    Sandra hat alles gut erklärt, ich wusste also vorab was
                    passiert. Der Schwung, die Farbe und wie lange es hält ist
                    einfach krass genial. Hab seit 2 Wochen keinen Mascara mehr
                    genutzt. Und am Ende noch ein Bürstchen bekommen. Voll cool.
                    Also echt zu empfehlen!!!
                  </p>
                </div>
                <footer className='mt-6'>
                  <p className='text-base font-light italic text-white'>
                    Susan R.
                  </p>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
      <div ref={ref} className='keen-slider'>
        {/* {reviewListItems} */}
      </div>
    </div>
  );
};

export default Testimonials;
