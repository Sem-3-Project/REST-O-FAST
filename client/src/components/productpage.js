import React from 'react';
import Header from '../components/Shop/Header'
import Products from '../components/Shop/Products'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { DataProvider } from '../components/Shop/DataProvider'
import Details from '../components/Shop/Details'
import Cart from '../components/Shop/Cart'
import '../components/Shop/index.css'
import Category from '../components/Shop/Category'

function ProductPage() {
    return (
        <DataProvider>
            <div className="App">
                <Router>
                    <Header />
                    <Switch>
                        <section>
                            <Route path="/productTable" exact component={Category} />
                            <Route path="/productTable/products/:id" exact component={Products} />
                            <Route path="/productTable/details/:id" component={Details} />
                            <Route path="/productTable/cart" component={Cart} />
                        </section>
                    </Switch>
                </Router>
            </div>
        </DataProvider>
    );
}

export default ProductPage;
