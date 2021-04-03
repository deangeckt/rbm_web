import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { exportFile } from '../Utils/SwcUtils';
import { AppContext } from '../Contexts/AppContext';
import { ILine } from '../Wrapper';


const downloadFile = (lines: ILine[], neuronRad: number) => {
	// TODO: remove redundant element created
	const element = document.createElement("a");
	const file = new Blob(exportFile(lines, neuronRad) ,{type: 'text/plain;charset=utf-8'});
	element.href = URL.createObjectURL(file);
	element.download = "swcTree.swc";
	document.body.appendChild(element);
	element.click();
}

function TopPanel() {
	const {state} = useContext(AppContext);
	const history = useHistory();
	return (
	<>
		<Button className="NoCapsButton" color="primary" variant="contained"
				onClick={() => downloadFile(state.lines, state.neuronRadius)}
				style={{marginLeft: '24px'}}>
			Export
		</Button>
		<big style={{color: 'black', display: 'block', fontSize: '26px'}}>
			RBM - Create your Neuron
		</big>
		<Button className="NoCapsButton" color="primary" variant="contained"
				onClick={() => history.push({pathname: '/simulate'})}
				style={{marginRight: '24px'}}>
			Start Simulate
		</Button>
	</>
  );
}

export default TopPanel;
