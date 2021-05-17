import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStyle } from './globalStyles';
import Hero from './Hero';
import Products from './Products';
import { productData, productDataTwo } from './Products/data';
import Feature from './Feature';
import Footer from './Footer';

function Home(props) {

    localStorage.setItem("tempTableId", props.match.params.id)
    console.log(localStorage.getItem("tempTableId"));

    return (
        <Router>
            <GlobalStyle />
            <Hero />
            <Products heading='Choose your favorite' data={productData} />
            <Feature />
            <Products heading='Sweet Treats for You' data={productDataTwo} />
            <Footer />
        </Router>
    );
}

export default Home;