import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import ProductPage from './components/productpage';
import KitchenProductPage from './components/KitchenProductPage';
import Checkout from './components/checkout/Checkout'


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/home/:id" component={Home} />
        <Route path="/productTable" component={ProductPage} />
        <Route path="/kitchenOrder" component={KitchenProductPage} />
        <Route path="/checkout" component={Checkout} />
      </Switch>
    </Router >
  );
}

export default App;
