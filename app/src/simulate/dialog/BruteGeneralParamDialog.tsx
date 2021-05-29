import React, { useContext } from 'react';
import { Dialog, DialogTitle, TextField } from '@material-ui/core';
import { useDialogs } from './useDialogs';
import { AppContext } from '../../AppContext';
import DialogContent from '@material-ui/core/DialogContent';
import { useBruteForce } from '../brute/useBruteForce';

export interface IBruteGeneralParamDialogProps {
    attrKey: string;
}

function BruteGeneralParamDialog({ attrKey }: IBruteGeneralParamDialogProps) {
    const { toggleBrute } = useDialogs();
    const { getSectionGeneralAttr, setSectionGeneralAttr } = useBruteForce();
    const { state } = useContext(AppContext);

    return (
        <Dialog onClose={() => toggleBrute(false, '')} open={state.dialogs.bruteState}>
            <DialogTitle> {attrKey} </DialogTitle>
            <DialogContent>
                <TextField
                    id="name"
                    label="Min"
                    type="number"
                    onChange={(e) => setSectionGeneralAttr(attrKey, 'min', Number(e.target.value))}
                    value={getSectionGeneralAttr(attrKey, 'min')}
                />
                <TextField
                    id="name"
                    label="Max"
                    type="number"
                    onChange={(e) => setSectionGeneralAttr(attrKey, 'max', Number(e.target.value))}
                    value={getSectionGeneralAttr(attrKey, 'max')}
                />
                <TextField
                    id="name"
                    label="Amount"
                    type="number"
                    onChange={(e) => setSectionGeneralAttr(attrKey, 'amount', Number(e.target.value))}
                    value={getSectionGeneralAttr(attrKey, 'amount')}
                    InputProps={{ inputProps: { min: 0 } }}
                />
            </DialogContent>
        </Dialog>
    );
}

export default BruteGeneralParamDialog;
