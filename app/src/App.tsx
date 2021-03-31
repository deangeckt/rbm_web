import React from 'react';
import { Button} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { importFile } from './Utils/SwcUtils';
import './App.css';
import { default_neuron_rad, ILine } from './design/Design';

function App() {
	const history = useHistory();
	const ilines: ILine[] = [];

	const uploadFile = async (e: any) => {
		e.preventDefault()
		const reader = new FileReader()
		reader.onload = async (e) => {
			const text = e?.target?.result;
			if (text) {
				const r = importFile(text as string);
				history.push( {pathname: '/design', state: {lines: r.lines, neuronRadius: r.neuronRadius}});
			}
		};
		reader.readAsText(e?.target?.files[0])
	}

	return (
		<div className="App">
				<div className="Container">
				<Button className="Button" variant="outlined" color="primary"
						onClick={() => history.push( {pathname: '/design', state: {lines: ilines, neuronRadius: default_neuron_rad}} )}>
					New Neuron
				</Button>
				<div className="Divider"/>
				<Button className="Button" variant="outlined" color="primary" component="label" >
					Import Neuron
					<input type="file" accept={".txt, .swc"} hidden onChange={(e) => uploadFile(e)}/>
				</Button>
			</div>
		</div>
  );
}

export default App;
