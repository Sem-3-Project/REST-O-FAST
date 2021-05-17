import React from 'react';
import { FeatureContainer, FeatureButton } from './FeatureElements';

const Feature = () => {
  return (
    <FeatureContainer>
      <h1>Pizza of the Day</h1>
      <p>Tandoori Paneer Pizza!!</p>
      <FeatureButton onClick={() => window.location.href = '/productTable/products/2'}>Order Now</FeatureButton>
    </FeatureContainer>
  );
};

export default Feature;
