import React, { useContext } from 'react';
import { Dialog, DialogTitle, TextField } from '@material-ui/core';
import { useDialogs } from './useDialogs';
import { AppContext } from '../../AppContext';
import DialogContent from '@material-ui/core/DialogContent';

export interface IBruteParamDialogProps {
    attrKey: string;
}

function BruteParamDialog({ attrKey }: IBruteParamDialogProps) {
    const { toggleBrute } = useDialogs();
    const { state } = useContext(AppContext);

    return (
        <Dialog onClose={() => toggleBrute(false)} open={state.dialogs.bruteState}>
            <DialogTitle> {attrKey} </DialogTitle>
            <DialogContent>
                <TextField
                    id="name"
                    label="Min"
                    type="number"
                    // onChange={(e) => setDesc(e.target.value)}
                    // value={desc}
                />
                <TextField
                    id="name"
                    label="Max"
                    type="number"
                    // onChange={(e) => setDesc(e.target.value)}
                    // value={desc}
                />
                <TextField
                    id="name"
                    label="Amount"
                    type="number"
                    // onChange={(e) => setDesc(e.target.value)}
                    // value={desc}
                />
            </DialogContent>
        </Dialog>
    );
}

export default BruteParamDialog;
