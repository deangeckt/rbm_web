import React, { useContext } from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';
import { useDialogs } from './useDialogs';
import { AppContext } from '../../AppContext';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

function InfoDialog() {
    const { closeInfo } = useDialogs();
    const { state } = useContext(AppContext);
    const imgRelPath = state.dialogs.infoImage;

    return (
        <Dialog onClose={() => closeInfo()} open={state.dialogs.infoState}>
            <DialogTitle> {state.dialogs.infoTitle} </DialogTitle>
            <DialogContent>
                <DialogContentText>{state.dialogs.infoContent}</DialogContentText>
                {imgRelPath ? <img src={`${process.env.PUBLIC_URL}/assets/${imgRelPath}`} /> : null}
            </DialogContent>
        </Dialog>
    );
}

export default InfoDialog;
