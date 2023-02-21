import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import NextImage from "next/image";
import { Element } from "react-scroll";
import image_1 from "/public/work/new/1.png";
import image_2 from "/public/work/new/2.png";
import image_3 from "/public/work/new/3.png";
import image_4 from "/public/work/new/4.png";
import image_5 from "/public/work/new/5.png";
import image_6 from "/public/work/new/6.png";
import image_7 from "/public/work/new/7.png";
import image_8 from "/public/work/new/8.png";
import image_9 from "/public/work/new/9.png";
import image_10 from "/public/work/new/10.png";
import image_11 from "/public/work/new/11.png";
import image_12 from "/public/work/new/12.png";

const imageList = [
  { image: image_1, alt: "image 1" },
  { image: image_2, alt: "image 2" },
  { image: image_3, alt: "image 3" },
  { image: image_4, alt: "image 4" },
  { image: image_5, alt: "image 5" },
  { image: image_6, alt: "image 6" },
  { image: image_7, alt: "image 6" },
  { image: image_8, alt: "image 6" },
  { image: image_9, alt: "image 6" },
  { image: image_10, alt: "image 6" },
  { image: image_11, alt: "image 6" },
  { image: image_12, alt: "image 6" },
];

const Slider: React.FunctionComponent = () => {
  const [loaded, setLoaded] = useState(false);
  const [, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 5 },
      },
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 10 },
      },
      "(min-width: 1000px)": {
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
        className="keen-slider__slide aspect-square h-full w-full "
        key={indeex}
      >
        <NextImage
          priority={true}
          src={image.image}
          placeholder="blur"
          alt={image.alt}
          className="h-full object-cover transition-all md:hover:scale-105"
        />
      </div>
    );
  });

  return (
    <div className="bg-fuchsia-50">
      <Element name="impressionen">
        <div id="impressionen">
          <div className="mx-auto max-w-2xl md:text-center lg:max-w-4xl">
            <h2 className="font-display px-4 pt-40 pb-12 text-3xl text-fuchsia-500 sm:text-4xl md:pb-24 lg:text-6xl ">
              Überzeuge dich selbst von meiner Arbeit.
            </h2>
          </div>

          <div ref={sliderRef} className="keen-slider relative z-10">
            {imagesList}
            {loaded && instanceRef.current && (
              <>
                <button
                  className="transparent group absolute left-0 h-full w-10 cursor-pointer md:w-20 "
                  onClick={(e) => {
                    e.stopPropagation();
                    instanceRef.current?.prev();
                  }}
                >
                  <svg
                    className={`bg-fuchsia-1000 absolute top-1/2 left-2 -mt-7 h-8 w-8 cursor-pointer rounded-full fill-white p-2 transition-all group-hover:scale-110 group-hover:bg-fuchsia-600 md:left-5 md:h-12 md:w-12 md:p-3`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
                  </svg>
                </button>
                <button
                  className="transparent group absolute right-0 h-full w-10 cursor-pointer md:w-20  "
                  onClick={(e) => {
                    e.stopPropagation();
                    instanceRef.current?.next();
                  }}
                >
                  <svg
                    className={`absolute top-1/2 right-2 -mt-7 h-8 w-8 cursor-pointer rounded-full bg-fuchsia-500 fill-white p-2 transition-all group-hover:scale-110 group-hover:bg-fuchsia-600 md:right-5 md:h-12 md:w-12 md:p-3`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </Element>
    </div>
  );
};

export default Slider;
