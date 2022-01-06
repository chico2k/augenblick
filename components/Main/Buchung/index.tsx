import ContactInformation from './Contact';
import BuchungsForm from './Form';

const BuchungsSection = () => {
  return (
    <div className='bg-white relative '>
      <div className='max-w-7xl mx-auto py-16 sm:py-24 sm:px-6 lg:px-8'>
        <h2 className='pl-5 bg-indigo-700 text-white text-3xl py-7'>Buchung</h2>

        <div className='bg-gray-100'>
          <h2 className='sr-only'>Buchung</h2>

          <div className='grid grid-cols-1 lg:grid-cols-3'>
            <BuchungsForm />
            <ContactInformation color={'gray'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuchungsSection;
