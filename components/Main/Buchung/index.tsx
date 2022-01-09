import ContactInformation from './Contact';
import BuchungsForm from './Form';

const BuchungsSection = () => {
  return (
    <div
      className=' bg-white relative  mx-auto mt-36  
      sm:py-24 
      md:container
      lg:px-8 lg:pb-18'
    >
      <h2 className='pl-5 bg-indigo-700 text-white text-3xl py-7'>Buchung</h2>
      <h2 className='sr-only'>Buchung</h2>

      <div
        className='
            grid grid-cols-1  bg-gray-100 pl-5 
            lg:grid-cols-3'
      >
        <BuchungsForm />

        <div
          className='
            fill-gray-900 text-gray-900 first-line:pt-8 pl-7 mb-8 mt-8 '
        >
          <ContactInformation />
        </div>
      </div>
    </div>
  );
};

export default BuchungsSection;
