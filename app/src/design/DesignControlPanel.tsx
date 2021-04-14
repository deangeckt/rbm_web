import React, { useContext } from 'react';
import { Button, InputAdornment, MenuItem, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { AppContext } from '../Contexts/AppContext';
import { none_selected, section_types, root_id, default_alpha } from '../Wrapper';
import './DesignControlPanel.css';
import { useDesignCanvas } from './useDesignCanvas';

function DesignControlPanel() {
    const { state, setState } = useContext(AppContext);
    const neuronSelected = state.selectedId === root_id;
    const lineSelected = state.selectedId !== none_selected && state.selectedId !== root_id;
    const {
        addNew,
        Delete,
        getSelectedLength,
        getSelectedAlpha,
        getSelectedRadius,
        getSelectedType,
        updateSimpleField,
        updateAlpha,
        updateLength,
    } = useDesignCanvas();

    return (
        <>
            {!neuronSelected && !lineSelected ? (
                <big style={{ color: 'black', alignSelf: 'center', fontSize: '16px', marginTop: '16px' }}>
                    Select a section to edit it
                </big>
            ) : (
                <div className="EditPanel">
                    <Button
                        className="NoCapsButton"
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => addNew()}
                    >
                        Add Section
                    </Button>
                    {lineSelected ? (
                        <>
                            <TextField
                                label={'Length [µM]'}
                                variant="filled"
                                type="number"
                                value={getSelectedLength()}
                                onChange={(e) => updateLength(Number(e.target.value))}
                            />
                            <TextField
                                label={'α [Rad]'}
                                variant="filled"
                                type="number"
                                value={getSelectedAlpha()}
                                onChange={(e) => updateAlpha(Number(e.target.value))}
                                InputProps={{
                                    inputProps: { min: 0, max: 2 * Math.PI, step: default_alpha * 0.1 },
                                    endAdornment: <InputAdornment position="end">PI</InputAdornment>,
                                }}
                            />
                            <TextField
                                label={'Radius [µM]'}
                                variant="filled"
                                type="number"
                                value={getSelectedRadius()}
                                onChange={(e) => updateSimpleField('radius', Number(e.target.value))}
                                InputProps={{ inputProps: { step: 0.1 } }}
                            />
                            <TextField
                                select
                                label="Type"
                                variant="filled"
                                value={getSelectedType()}
                                onChange={(e) => updateSimpleField('tid', Number(e.target.value))}
                            >
                                {section_types.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<DeleteIcon />}
                                onClick={() => Delete()}
                            >
                                Delete Section
                            </Button>
                        </>
                    ) : (
                        <TextField
                            label={'Neuron Radius [µM]'}
                            variant="filled"
                            type="number"
                            value={state.neuronRadius}
                            InputProps={{ inputProps: { min: 0 } }}
                            onChange={(e) => setState({ ...state, neuronRadius: Number(e.target.value) })}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default DesignControlPanel;
