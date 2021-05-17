import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { DataProvider } from './Shop/DataProvider'
import '../components/Shop/index.css'
import KitchenHeader from './kitchen/kitchenHeader';
import KitchenOrder from './kitchen/orderNumbers';
import OrderDetails from './kitchen/orderDetails';



function KitchenProductPage() {
    return (
        <DataProvider>
            <div className="App">
                <Router>
                    <KitchenHeader />
                    <Switch>
                        <section>
                            <Route path='/kitchenOrder' exact component={KitchenOrder} />
                            <Route path='/kitchenOrder/orderDetails/:oid/:tno' exact component={OrderDetails} />
                        </section>
                    </Switch>
                </Router>
            </div>
        </DataProvider>
    );
}

export default KitchenProductPage;
