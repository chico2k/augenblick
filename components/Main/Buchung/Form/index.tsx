import React from 'react';

const BuchungsForm = () => {
  return (
    <>
      <div className='bg-gray-100 pt-10 px-6 sm:px-10 lg:col-span-2 xl:p-12'>
        <form
          action='#'
          method='POST'
          className='mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8'
        >
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-900'
            >
              Name
            </label>
            <div className='mt-1'>
              <input
                type='text'
                name='name'
                id='name'
                autoComplete='given-name'
                className='py-3 px-4 block w-full shadow-lg shadow-indigo-300/20 text-gray-900  focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md'
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-900'
            >
              Email
            </label>
            <div className='mt-1'>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                className='py-3 px-4 block w-full shadow-lg shadow-indigo-300/20 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md'
              />
            </div>
          </div>
          <div>
            <div className='flex justify-between'>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-900'
              >
                Telefon
              </label>
            </div>
            <div className='mt-1'>
              <input
                type='text'
                name='phone'
                id='phone'
                autoComplete='tel'
                className='py-3 px-4 block w-full  shadow-lg shadow-indigo-300/20 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md'
                aria-describedby='phone-optional'
              />
            </div>
          </div>

          <div className='sm:col-span-2'>
            <div className='flex justify-between'>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-gray-900'
              >
                Nachricht
              </label>
            </div>
            <div className='mt-1'>
              <textarea
                id='message'
                name='message'
                rows={4}
                className='py-3 px-4 block w-full shadow-lg shadow-indigo-300/20  text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md'
                aria-describedby='message-max'
                defaultValue={''}
              />
            </div>
          </div>
          <div className='sm:col-span-2 sm:flex sm:justify-end'>
            <button
              type='submit'
              className='mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto'
            >
              Anfragen
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BuchungsForm;
