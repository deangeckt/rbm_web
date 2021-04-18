import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { IStaticGlobalInput } from '../../Wrapper';
import { useSimulate } from '../useSimulate';
import { useDialogs } from '../dialogs/useDialogs';

export interface IGlobalInputProps {
    input: IStaticGlobalInput;
}

function GlobalInput({ input }: IGlobalInputProps) {
    const { updateStaticGloablnput } = useSimulate();
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
                    onChange={(e: any) => updateStaticGloablnput(input.id, Number(e.target.value))}
                />
            </div>
        </>
    );
}

export default GlobalInput;
