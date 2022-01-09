import NextImage from 'next/image';
import { ISandraSection } from '../../Images/types';

interface IProps {
  sandraSectionImages: ISandraSection;
}

const SandraComponent: React.FC<IProps> = ({ sandraSectionImages }) => {
  return (
    <>
      <div className='sandra__wrapper'>
        <div className='sandra__textContainer'>
          <h2 className='sandra__sectionHeader'>Über mich</h2>
          <p className='sandra__text'>
            Ich bin zertifizierte Wimpernexpertin. Mit Liebe und Leidenschaft,
            möchte ich für meinen Kundinnen einen perfektes Ergenbnis zielen.
            <br />
            <span className='sandra__name'>Sandra Rudic</span>
          </p>
        </div>
        <div className='sandra__imageWrapper'>
          <NextImage
            layout='fill'
            src='/sandra_about.jpg'
            objectFit='cover'
            placeholder='blur'
            className='overflow-hidden'
            blurDataURL={sandraSectionImages.sandra.base64}
          />
        </div>
      </div>
    </>
  );
};
export default SandraComponent;
