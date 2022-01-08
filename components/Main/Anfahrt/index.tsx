import React from 'react';

const AnfahrtSection = () => {
  return (
    <div className='mt-36 max-w-7xl mx-auto sm:px-6 lg:px-8 '>
      <h2 className='pl-5 mb-8  text-indigo-700 text-2xl'> Anfahrt</h2>
      <div className='w-full h-screen text-xs'>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10690.83700606855!2d12.6016273!3d47.9420075!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xd66571c4270f68c7!2sAugenblick%20Chiemgau!5e0!3m2!1sen!2sde!4v1640699367324!5m2!1sen!2sde'
          width='100%'
          height='100%'
          className='overflow-hidden '
          loading='lazy'
        />
      </div>
    </div>
  );
};

export default AnfahrtSection;
