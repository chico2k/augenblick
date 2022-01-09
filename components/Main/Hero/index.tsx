import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import CTA from './CTA';
import { IHeroSection } from '../../Images/types';
import { Scroll } from './Scroll';
import HeaderSection from '../../Header';
import Navigation from '../../Header/Navigation';
import BackgroundImage from './BackgroundImage';
import HeroContent from './Content';
import Container from '../../Layout';

interface IProps {
  heroSectionImages: IHeroSection;
}

const HeroSection: React.FC<IProps> = ({ heroSectionImages }) => {
  return (
    <>
      <section className='w-screen h-screen relative'>
        <Navigation />
        <BackgroundImage />
        <HeroContent />
      </section>
    </>
  );
};

export default HeroSection;
