import React, { useContext } from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';
import { useDialogs } from './useDialogs';
import { AppContext } from '../../AppContext';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

function InfoDialog() {
    const { closeDialog } = useDialogs();
    const { state } = useContext(AppContext);

    return (
        <Dialog onClose={() => closeDialog()} open={state.dialogs.dialogInfo}>
            <DialogTitle> {state.dialogs.dialogInfoTitle} </DialogTitle>
            <DialogContent>
                <DialogContentText>{state.dialogs.dialogInfoContent}</DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default InfoDialog;
