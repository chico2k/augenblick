import { useEffect } from 'react';
// @ts-ignore
import lax from 'lax.js';

export const useLaxLibrary = () => {
  useEffect(() => {
    //@ts-ignore
    window.lax = { presets: lax.presets };
    lax.init();

    lax.addDriver('scrollY', function () {
      return window.scrollY;
    });

    /**
     * Angebot
     *
     */
    lax.addElements('.lax__angebot_background', {
      scrollY: {
        scale: [
          ['elInY', 'elCenterY', 'elOutY'],
          [1, 1.3, 2],
          {
            easing: 'easeInQuart',
          },
        ],
      },
    });

    /**
     * Sandra 
     */
    lax.addElements('.lax__sandra__wimpern', {
      scrollY: {
        opacity: [
          ['elInY', 'elCenterY', 'elOutY'],
          [0, 0.4, 0],
          {
            easing: 'easeInQuart',
          },
        ],

      },
    });
    /**
     * Caption 
     */
    lax.addElements('.lax__strong_lash', {
      scrollY: {
        opacity: [
          ['elInY', 'elCenterY', 'elOutY'],
          [0.6, 0.8, 0.8],
          {
            easing: 'easeInQuart',
          },
        ],
        scale: [
          ['elInY', 'elCenterY', 'elOutY'],
          [1, 1.4, 1.4],
          {
            easing: 'easeInQuart',
          },
        ],
      },
    });


    lax.addElements('.lax__angebot_right', {
      scrollY: {
        translateX: [
          ['elInY', 'elCenterY', 'elOutY'],
          [10, 0, 0],
          {
            easing: 'easeInQuart',
          },
        ],
      },
    });

    /**
     * Studio
     */
    lax.addElements('.lax__studio__image', {
      scrollY: {
        scale: [
          ['elInY', 'elCenterY', 'elOutY'],
          [0.8, 1, 1.25],
          {
            easing: 'easeInQuad',
          },
        ],
      },
    });

    lax.addElements('.lax__studio__text', {
      scrollY: {
        translateY: [
          ['elInY', 'elCenterY', 'elOutY'],
          [0, 0, -500],
          {
            easing: 'easeInQuad',
          },
        ],
      },
    });

    return () => {
      lax.remove;
    };
  }, []);
  return {};
};
