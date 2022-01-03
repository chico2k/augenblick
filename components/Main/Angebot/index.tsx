import React from 'react';

const products = [
  { id: 1, title: 'Lifting', subTitle: undefined, price: 39, popular: false },
  {
    id: 2,
    title: 'Verlängerung',
    subTitle: '1 zu 1 Technik',
    price: 59,
    popular: true,
  },
  {
    id: 3,
    title: 'Verlängerung',
    subTitle: '3D Technik',
    price: 69,
    popular: false,
  },
];

const MostPopular: React.FC<{ mostPopular: boolean }> = ({ mostPopular }) => {
  if (!mostPopular) return null;
  return (
    <div className='absolute inset-x-0 top-0 transform translate-y-px'>
      <div className='flex justify-center transform -translate-y-1/2'>
        <span className='inline-flex rounded-full bg-gradient-to-tr from-indigo-700 via-indigo-500 to-indigo-700  px-4 py-1 text-sm font-semibold tracking-wider uppercase text-white'>
          Am beliebtesten
        </span>
      </div>
    </div>
  );
};

const AngebotSection = () => {
  const productList = products.map((product) => {
    return (
      <>
        <div className='px-4 mb-16 relative' key={product.id}>
          <MostPopular mostPopular={product.popular} />
          <div className='shadow-lg  shadow-indigo-300/30  h-44  rounded-xl flex items-center justify-center bg-white border '>
            <div className='w-full text-center'>
              <div className='text-center '>
                <h3 className='text-3xl font-medium text-gray-900 tracking-wider '>
                  {product.title}
                </h3>
                <div className='text-center text-xl font-light mb-3'>
                  {product.subTitle}
                </div>
                <div className='text-center'>
                  <span className='px-3 flex items-start text-6xl tracking-tight text-gray-900 justify-center align-center'>
                    <span className='mt-1 mr-2 text-3xl font-medium'>€</span>
                    <span className='font-extrabold text-5xl'>
                      {product.price}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  });

  return (
    <div className='pb-16 pt-32'>
      <div className='pt-12 bg-gradient-to-tr from-indigo-400 via-indigo-500 to-indigo-700 pb-32 px-4 sm:px-6 lg:px-8 lg:pt-20 '>
        <div className='text-center'>
          <h2 className='underline underline-offset-8 text-lg leading-6 font-semibold text-white uppercase tracking-wider'>
            Angebot
          </h2>
          <p className='mt-8 text-3xl font-bold text-white sm:text-4xl lg:text-5xl'>
            Für jeden Stil das richtige Angebot
          </p>
        </div>
      </div>
      <div className='-mt-24'>{productList}</div>
    </div>
  );
};

export default AngebotSection;

/* This example requires Tailwind CSS v2.0+ */
