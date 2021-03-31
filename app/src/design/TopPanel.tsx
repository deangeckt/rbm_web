import React from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { ILine } from './Design';
import { exportFile } from '../Utils/SwcUtils';

export interface ITopPanelProps {
	lines: ILine[];
	neuronRad: number;
}

const downloadFile = (lines: ILine[], neuronRad: number) => {
	// TODO remove redundant element created
	const element = document.createElement("a");
	const file = new Blob(exportFile(lines, neuronRad) ,{type: 'text/plain;charset=utf-8'});
	element.href = URL.createObjectURL(file);
	element.download = "swcTree.swc";
	document.body.appendChild(element);
	element.click();
}

function TopPanel({lines, neuronRad}: ITopPanelProps) {
	const history = useHistory();
	return (
	<>
		<Button className="NoCapsButton" color="primary" variant="contained"
				onClick={() => downloadFile(lines, neuronRad)}
				style={{marginLeft: '24px'}}>
			Export
		</Button>
		<big style={{color: 'black', display: 'block', fontSize: '26px'}}>
			RBM - Create your Neuron
		</big>
		<Button className="NoCapsButton" color="primary" variant="contained"
				onClick={() => history.push( {pathname: '/simulate'} )}
				style={{marginRight: '24px'}}>
			Start Simulate
		</Button>
	</>
  );
}

export default TopPanel;
