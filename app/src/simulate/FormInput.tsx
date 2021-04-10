import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { IFormInput } from '../Wrapper';
import { useSimulate } from './useSimulate';

export interface IFormsInputProps {
    input: IFormInput;
    updateDialogInfo: (id: string) => void;
}

function FormInput(props: IFormsInputProps) {
    const { updateInput } = useSimulate();

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => props.updateDialogInfo(props.input.id)}
                    startIcon={<InfoIcon />}
                ></Button>
                <TextField
                    label={props.input.name}
                    variant="filled"
                    type="number"
                    defaultValue={props.input.value}
                    onChange={(e: any) => updateInput(props.input.id, Number(e.target.value))}
                />
            </div>
        </>
    );
}

export default FormInput;
