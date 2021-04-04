import { IFormInput } from './Simulate';
import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import { Button, TextField } from '@material-ui/core';

export interface IFormsInputProps {
    input: IFormInput;
    idx: number;
    updateInput: (idx: number, val: number) => void;
    openTooltip: (idx: number) => void;
}

function FormInput(props: IFormsInputProps) {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => props.openTooltip(props.idx)}
                    startIcon={<InfoIcon />}
                ></Button>
                <TextField
                    label={props.input.name}
                    variant="filled"
                    type="number"
                    defaultValue={props.input.value}
                    onChange={(e: any) => props.updateInput(props.idx, Number(e.target.value))}
                />
            </div>
        </>
    );
}

export default FormInput;
