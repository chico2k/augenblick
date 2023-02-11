const Footer = () => {
  return (
    <footer className='bg-fuchsia-500 text-white pt-20 '>
      <div className='max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8'>
        <div className='pl-5 grid grid-cols-2 grid-rows-2'>
          <div>Buchung</div>
          <div>Datenschutz</div>
          <div>Angebot</div>
          <div>Impressum</div>
        </div>
        <div className='mt-16 pl-5 fill-gray-300 text-gray-300 '></div>
        <div className='mt-16 '>
          <p className='mt-8 text-center text-base text-gray-300'>
            &copy; 2022 Augenblick
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
