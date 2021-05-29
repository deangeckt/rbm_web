import React, { useContext } from 'react';
import { Dialog, DialogTitle, TextField } from '@material-ui/core';
import { useDialogs } from './useDialogs';
import { AppContext } from '../../AppContext';
import DialogContent from '@material-ui/core/DialogContent';
import { useBruteForce } from '../brute/useBruteForce';
import { impKeys } from '../../Wrapper';

export interface IBruteParamDialogProps {
    attrKey: string;
    impKey: impKeys;
}

function BruteParamDialog({ attrKey, impKey }: IBruteParamDialogProps) {
    const { toggleBrute } = useDialogs();
    const { getMechAttr, setMechAttr } = useBruteForce();
    const { state } = useContext(AppContext);

    return (
        <Dialog onClose={() => toggleBrute(false, '')} open={state.dialogs.bruteState}>
            <DialogTitle> {attrKey} </DialogTitle>
            <DialogContent>
                <TextField
                    id="name"
                    label="Min"
                    type="number"
                    onChange={(e) => setMechAttr(impKey, attrKey, 'min', Number(e.target.value))}
                    value={getMechAttr(impKey, attrKey, 'min')}
                />
                <TextField
                    id="name"
                    label="Max"
                    type="number"
                    onChange={(e) => setMechAttr(impKey, attrKey, 'max', Number(e.target.value))}
                    value={getMechAttr(impKey, attrKey, 'max')}
                />
                <TextField
                    id="name"
                    label="Amount"
                    type="number"
                    onChange={(e) => setMechAttr(impKey, attrKey, 'amount', Number(e.target.value))}
                    value={getMechAttr(impKey, attrKey, 'amount')}
                    InputProps={{ inputProps: { min: 0 } }}
                />
            </DialogContent>
        </Dialog>
    );
}

export default BruteParamDialog;
