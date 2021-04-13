import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { IGlobalInput } from '../../Wrapper';
import { useSimulate } from '../useSimulate';
import { useDialogs } from '../Dialogs/useDialogs';

export interface IGlobalInputProps {
    input: IGlobalInput;
}

function GlobalInput({ input }: IGlobalInputProps) {
    const { updateInput } = useSimulate();
    const { updateDialogInfo } = useDialogs();

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => updateDialogInfo(input.id)}
                    startIcon={<InfoIcon />}
                ></Button>
                <TextField
                    label={input.name}
                    variant="filled"
                    type="number"
                    defaultValue={input.value}
                    onChange={(e: any) => updateInput(input.id, Number(e.target.value))}
                />
            </div>
        </>
    );
}

export default GlobalInput;
