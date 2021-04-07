import React from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import { IStimInput, types } from '../Wrapper';
import { useSimulate } from './useSimulate';

export interface IStimInputProps {
    stim: IStimInput;
    idx: number;
}

function StimInput({ stim, idx }: IStimInputProps) {
    const { updateStim } = useSimulate();

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    select
                    label="Type"
                    variant="filled"
                    value={stim.type}
                    onChange={(e) => updateStim('type', Number(e.target.value), idx)}
                >
                    {types.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label={'Id'}
                    variant="filled"
                    type="number"
                    defaultValue={stim.id}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(e) => updateStim('id', Number(e.target.value), idx)}
                />
                <TextField
                    label={'Section'}
                    variant="filled"
                    type="number"
                    defaultValue={stim.section}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(e) => updateStim('section', Number(e.target.value), idx)}
                />
                <TextField
                    label={'Delay [mS]'}
                    variant="filled"
                    type="number"
                    defaultValue={stim.delay}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(e) => updateStim('delay', Number(e.target.value), idx)}
                />
                <TextField
                    label={'Duration [mS]'}
                    variant="filled"
                    type="number"
                    defaultValue={stim.duration}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(e) => updateStim('duration', Number(e.target.value), idx)}
                />
                <TextField
                    label={'Amplitude [mA]'}
                    variant="filled"
                    type="number"
                    defaultValue={stim.amplitude}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(e) => updateStim('amplitude', Number(e.target.value), idx)}
                />
            </div>
        </>
    );
}

export default StimInput;
