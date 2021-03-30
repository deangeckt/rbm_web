import React from 'react';
import { Button, InputAdornment, MenuItem, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { default_alpha } from './Design';
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
    canAdd: boolean;
    canEdit: boolean;
}

export const types = [
	{
	  value: 0,
	  label: 'undefined',
	},
	{
	  value: '2',
	  label: 'axon',
	},
	{
	  value: '3',
	  label: 'basal dendrite',
	},
	{
	  value: '4',
	  label: 'apical dendrite',
	},
];


function ControlPanel({addNew, Delete, getSelectedLength,
                       getSelectedAlpha, getSelectedRadius, getSelectedType,
                       updateSimpleField, updateAlpha, updateLength, canAdd, canEdit  }: IControlPanelProps) {
	return (
    <>
		<Button className="NoCapsButton" variant="outlined" color="primary" startIcon={<AddIcon />}
				disabled={canAdd} onClick={() => addNew()}>
			Add Line
		</Button>
        <div className="EditPanel">
            <TextField label={'Length [µM]'} variant="filled" type="number" value={getSelectedLength()}
                        disabled={canEdit}
                        onChange={(e) => updateLength(Number(e.target.value))} />
            <TextField label={'α [Rad]'} variant="filled" type="number" value={getSelectedAlpha()}
                        disabled={canEdit}
                        onChange={(e) => updateAlpha(Number(e.target.value))}
                        InputProps={{	inputProps: { min: 0, max: 2 * Math.PI, step: default_alpha * 0.1,  },
                                        endAdornment: <InputAdornment position="end">PI</InputAdornment>, }} />
            <TextField label={'Radius [µM]'} variant="filled" type="number" value={getSelectedRadius()}
                        disabled={canEdit}
                        onChange={(e) => updateSimpleField('radius', Number(e.target.value))} />
            <TextField select label="Type" variant="filled"  value={getSelectedType()}
                        onChange={(e) => updateSimpleField('tid', Number(e.target.value))}
                        disabled={canEdit} >
                {types.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <Button variant="outlined" color="primary" startIcon={<DeleteIcon />}
                    disabled={canEdit} onClick={() => Delete()}>
                Delete Line
            </Button>
        </div>
    </>
  );
}

export default ControlPanel;
