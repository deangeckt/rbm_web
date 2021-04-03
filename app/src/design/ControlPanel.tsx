import React, { useContext } from 'react';
import { Button, InputAdornment, MenuItem, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { default_alpha } from './Design';
import { AppContext } from '../Contexts/AppContext';

import './ControlPanel.css';


export interface IControlPanelProps {
	addNew: Function;
    Delete: Function;
    getSelectedLength: Function;
    getSelectedAlpha: Function;
    getSelectedRadius: Function;
    getSelectedType: Function;
    updateSimpleField: Function;
    updateAlpha: Function;
    updateLength: Function;
    neuronSelected: boolean;
    lineSelected: boolean;
}

export const types = [
	{
		value: 0,
		label: 'undefined',
	},
	{
		value: 1,
		label: 'soma',
	},
	{
		value: 2,
		label: 'axon',
	},
	{
		value: 3,
		label: 'basal dendrite',
	},
	{
		value: 4,
		label: 'apical dendrite',
	},
	{
		value: 5,
		label: 'custom',
	},
];


function ControlPanel({addNew, Delete, getSelectedLength,
                       getSelectedAlpha, getSelectedRadius, getSelectedType,
                       updateSimpleField, updateAlpha, updateLength, neuronSelected, lineSelected
					   }: IControlPanelProps) {

	const {state, setState} = useContext(AppContext);

	return (
    <>
    {!neuronSelected && !lineSelected ? (
		<big style={{color: 'black', alignSelf: 'center', fontSize: '16px', marginTop: '16px'}}>
				Select an object to edit it
		</big> ) : (
		<div className="EditPanel">
			<Button className="NoCapsButton" variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => addNew()}>
				Add Line
			</Button>
			{lineSelected ? (
				<>
				<TextField label={'Length [µM]'} variant="filled" type="number" value={getSelectedLength()}
							onChange={(e) => updateLength(Number(e.target.value))} />
				<TextField label={'α [Rad]'} variant="filled" type="number" value={getSelectedAlpha()}
							onChange={(e) => updateAlpha(Number(e.target.value))}
							InputProps={{	inputProps: { min: 0, max: 2 * Math.PI, step: default_alpha * 0.1,  },
											endAdornment: <InputAdornment position="end">PI</InputAdornment>, }} />
				<TextField label={'Radius [µM]'} variant="filled" type="number" value={getSelectedRadius()}
							onChange={(e) => updateSimpleField('radius', Number(e.target.value))}
							InputProps={{inputProps: { step: 0.1,  }}} />
				<TextField select label="Type" variant="filled"  value={getSelectedType()}
							onChange={(e) => updateSimpleField('tid', Number(e.target.value))} >
					{types.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</TextField>
				<Button variant="outlined" color="primary" startIcon={<DeleteIcon />} onClick={() => Delete()}>
					Delete Line
				</Button>
				</>
				) : (
				<TextField label={'Neuron Radius [µM]'} variant="filled" type="number" value={state.neuronRadius}
							onChange={(e) => Number(e.target.value) > 0 && 	setState({...state, neuronRadius: Number(e.target.value)})} />
			)}
		</div>
	)}
    </>
  );
}

export default ControlPanel;
