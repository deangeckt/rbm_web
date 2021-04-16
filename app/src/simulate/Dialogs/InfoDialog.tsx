import React, { useContext } from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';
import { useDialogs } from './useDialogs';
import { AppContext } from '../../AppContext';

function InfoDialog() {
    const { setDialogInfo } = useDialogs();
    const { state } = useContext(AppContext);

    return (
        <Dialog onClose={() => setDialogInfo(false)} open={state.dialogs.dialogInfo}>
            <DialogTitle> {state.dialogs.dialogInfoTitle} </DialogTitle>
        </Dialog>
    );
}

export default InfoDialog;
