import { sectionImages } from '.';

export type IObjectWithUrlProps = {
  [key: string]: IUrlProps;
};

export type ISection = IObjectWithUrlProps | IUrlProps[];

export type IUrlProps = {
  id: number;
  url: string;
  base64: string;
};

export type IHeroSection = {
  hero: IUrlProps;
};

export type ISandraSection = {
  sandra: IUrlProps;
};

export type ITestimonialsSection = {
  number1: IUrlProps;
};

export type ISlideSection = IUrlProps[];
export type SectionKeys = Array<keyof typeof sectionImages>;

export interface IBlurOutput {
  heroSectionImages: IHeroSection;
  sandraSectionImages: ISandraSection;
  slideSectionImages: ISlideSection;
  testimonialsSectionImages: ITestimonialsSection;
}
