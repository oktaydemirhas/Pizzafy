import React from 'react';
import Order from './pages/Order';
import Home from './pages/Home';
import OrderCompleted from './pages/OrderCompleted';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {

  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/order">
            <Order />
          </Route>
          <Route path="/order-completed">
            <OrderCompleted />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;