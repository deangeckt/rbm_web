import React from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";

import './App.css';

function App() {
	const history = useHistory();
	return (
		<div className="App">
			<Button className="Button" variant="outlined" color="primary" onClick={() => history.push( {pathname: '/design'} )}>
				New Neuron
			</Button>

			<Button className="Button" variant="outlined" color="primary" onClick={() => console.log('fgsf')}>
				Import Neuron
			</Button>
		</div>

  );
}

export default App;
