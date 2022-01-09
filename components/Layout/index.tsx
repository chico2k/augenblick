import React from 'react';

const Container: React.FC = ({ children }) => {
  return <div className='container lg:px-32'>{children}</div>;
};

export default Container;
