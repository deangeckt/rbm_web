import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { IStimInput } from '../../Wrapper';
import { useSimulate } from '../useSimulate';
import DeleteIcon from '@material-ui/icons/Delete';
import SectionInput from './SectionInput';

export interface IStimInputProps {
    stim: IStimInput;
    idx: number;
}

function StimInput({ stim, idx }: IStimInputProps) {
    const { updateStimSection, updateStimSimple, deleteStim } = useSimulate();

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <SectionInput section={stim.section} idx={idx} update={updateStimSection} />
                <TextField
                    label={'Delay [mS]'}
                    variant="filled"
                    type="number"
                    defaultValue={stim.delay}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(e) => updateStimSimple('delay', Number(e.target.value), idx)}
                />
                <TextField
                    label={'Duration [mS]'}
                    variant="filled"
                    type="number"
                    defaultValue={stim.duration}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(e) => updateStimSimple('duration', Number(e.target.value), idx)}
                />
                <TextField
                    label={'Amplitude [mA]'}
                    variant="filled"
                    type="number"
                    defaultValue={stim.amplitude}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(e) => updateStimSimple('amplitude', Number(e.target.value), idx)}
                />
                <Button
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteStim(idx)}
                >
                    Delete
                </Button>
            </div>
        </>
    );
}

export default StimInput;
