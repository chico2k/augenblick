import NextImage from 'next/image';
import { ISandraSection } from '../../Images/types';

interface IProps {
  sandraSectionImages: ISandraSection;
}

const SandraComponent: React.FC<IProps> = ({ sandraSectionImages }) => {
  return (
    <>
      <div className='container px-5 mt-36 mb-9'>
        <h2 className='text-indigo-700 text-2xl mb-3'>Über mich</h2>
        <p className='text-base'>
          Ich bin zertifizierte Wimpernexpertin. Mit Liebe und Leidenschaft,
          möchte ich für meinen Kundinnen einen perfektes Ergenbnis zielen.
          <br />
          <span className='block text-indigo-700 font-light italic mt-3'>
            Sandra Rudic
          </span>
        </p>
      </div>

      <div className='w-full relative aspect-square'>
        <NextImage
          layout='fill'
          src='/sandra_about.jpg'
          objectFit='cover'
          placeholder='blur'
          blurDataURL={sandraSectionImages.sandra.base64}
        />
      </div>
    </>
  );
};
export default SandraComponent;
