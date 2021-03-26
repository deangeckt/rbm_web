import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Design from './design/Design';


const routing = (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route exact path="/design" component={Design} />
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))

