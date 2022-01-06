import React from 'react';

const products = [
  { id: 1, title: 'Lifting', subTitle: 'Lotion', price: 39, popular: false },
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
        <span className='inline-flex rounded-full bg-white border-2 solid border-indigo-700  text-indigo-700 text-xl px-4 py-1  font-semibold tracking-wider uppercase '>
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
        <div className='mb-16 relative ' key={product.id}>
          <MostPopular mostPopular={product.popular} />
          <div className='shadow-lg  shadow-indigo-300/30  h-72  rounded-xl flex items-center justify-center bg-white border '>
            <div className='w-full text-center'>
              <div className='text-center '>
                <h3 className='text-xl font-semibold text-gray-700 uppercase'>
                  {product.title}
                </h3>
                <div className='text-center text-indigo-700 text-2xl font-light'>
                  {product.subTitle}
                </div>
                <div className='text-center mt-6'>
                  <span className='px-3 flex items-start text-6xl tracking-tight text-gray-900 justify-center align-center'>
                    <span className='text-6xl'>{product.price}</span>
                    <span className='text-3xl font-medium'>€</span>
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
    <>
      <div className='container mt-16 pt-16'>
        <div className='bg-gradient-to-tr from-indigo-400 via-indigo-500 to-indigo-700  px-5 pb-64'>
          <h3 className='text-2xl text-center text-white py-9'>Angebot</h3>
          <div>{productList}</div>
        </div>
      </div>
    </>
  );
};

export default AngebotSection;
