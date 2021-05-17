import React from 'react';
import {
  ProductsContainer,
  ProductWrapper,
  ProductsHeading,
  ProductTitle,
  ProductCard,
  ProductImg,
  ProductInfo,
  ProductDesc,
  ProductPrice,
  ProductButton
} from './ProductsElements';

const Products = ({ heading, data }) => {

  const redirect = (name) => {
    if (name === 'Masala Dosa') {
      window.location.href = '/productTable/products/1'
    }
    else if (name === 'Pav Bhaji') {
      window.location.href = '/productTable/products/3'
    }
    else if (name === 'Paneer Butter Masala') {
      window.location.href = '/productTable/products/5'
    }
    else if (name === 'Apple Pie') {
      window.location.href = '/productTable/products/4'
    }
    else if (name === 'Fruit Salad') {
      window.location.href = '/productTable/products/4'
    }
    else if (name === 'Chocolate Brownie') {
      window.location.href = '/productTable/products/4'
    }
  }

  return (
    <ProductsContainer>
      <ProductsHeading>{heading}</ProductsHeading>
      <ProductWrapper>
        {data.map((product, index) => {
          return (
            <ProductCard key={index}>
              <ProductImg src={product.img} alt={product.alt} />
              <ProductInfo>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductDesc>{product.desc}</ProductDesc>
                <ProductPrice>{product.price}</ProductPrice>
                <ProductButton onClick={() => redirect(product.name)}>{product.button}</ProductButton>
              </ProductInfo>
            </ProductCard>
          );
        })}
      </ProductWrapper>
    </ProductsContainer>
  );
};

export default Products;
