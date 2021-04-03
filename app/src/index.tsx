import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Design from './design/Design';
import Simulate from './simulate/Simulate';
import Wrapper from './Wrapper';


const routing = (
  <Router>
    <Wrapper>
      <Route exact path="/" component={App} />
      <Route exact path="/design" component={Design} />
      <Route exact path="/simulate" component={Simulate} />
    </Wrapper>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))

