import React from 'react';
import NextImage from 'next/image';
import { ITestimonialsSection } from '../../Images/types';
import Stars from './Stars';

interface IProps {
  testimonialsSectionImages: ITestimonialsSection;
}

const Testimonials: React.FC<IProps> = ({ testimonialsSectionImages }) => {
  return (
    <div className='container mt-32 mb-8 mx-auto sm:px-12 lg:px-16'>
      <h3 className='text-indigo-700 text-2xl ml-5 mb-9'>Kundenmeinungen</h3>
      <div className='grid grid-rows-2 gap-8'>
        <div className='grid grid-cols-1 relative sm:grid sm:grid-cols-2'>
          <div className='w-full aspect-square shadow-xl overflow-hidden relative self-center'>
            <div className='absolute left-5 text-base top-3  font-medium  rounded-xl w-40  h-8 bg-indigo-700 text-white z-10 flex justify-center '>
              <span className='self-center'> Verlängerung</span>
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
          <div className='my-6 mx-auto px-5'>
            <blockquote>
              <div className='flex'>
                <div className='text-yellow-400 '>
                  <Stars />
                </div>
              </div>
              <p className='mt-6 text-md text-gray-700'>
                Es war richtig cool. Mein erstes Mal Wimpern Lifting und Sandra
                hat alles gut erklärt, ich wusste also vorab was passiert. Der
                Schwung, die Farbe und wie lange es hält ist einfach krass
                genial. Hab seit 2 Wochen keinen Mascara mehr genutzt. Und am
                Ende noch ein Bürstchen bekommen. Voll cool. Also echt zu
                empfehlen!!!
              </p>
              <footer className='mt-6'>
                <span className='italic'> Susan R.</span>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className='grid grid-cols-1 relative sm:grid sm:grid-cols-2'>
          <div className='w-full aspect-square shadow-xl overflow-hidden relative self-center'>
            <div className='absolute left-5 text-base top-3  font-medium  rounded-xl w-40  h-8 bg-indigo-700 text-white z-10 flex justify-center '>
              <span className='self-center'> Lifting</span>
            </div>
            <NextImage
              className='overflow-hidden '
              src={testimonialsSectionImages.number2.url}
              alt='Testimonial'
              layout='fill'
              objectFit='cover'
              placeholder='blur'
              blurDataURL={testimonialsSectionImages.number2.base64}
            />
          </div>
          <div className='my-6 mx-auto px-5'>
            <blockquote>
              <div className='flex'>
                <div className='text-yellow-400 '>
                  <Stars />
                </div>
              </div>
              <p className='mt-6 text-md text-gray-700'>
                Ich bin sowas von begeistert 😍 die liebe Sandra hat mir ein
                wunderschönes Lashlifting verpasst. Da wirken die Augen gleich
                nochmal viel wacher und die Wimpern deutlich länger 😊 Ich war
                vorab etwas verunsichert da ich keider oftmals gegen neue
                Produkte etc allergisch reagiere. Wir haben vorab einen Test
                gemacht (war alles bestens) und konnten dann die wiche drauf
                gleich loslegen. Sandra ist eine total liebe, man findet sofort
                ein Gesprächsthema mit Ihr. Sie arbeitet sehr sauber und
                gewissenhaft. Bin mehr als zufrieden und empfehle sie
                uneingeschränkt jeden weiter ❤️
              </p>
              <footer className='mt-6'>
                <span className='italic'> Kristina M. </span>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
