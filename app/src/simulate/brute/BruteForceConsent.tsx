import React, { useContext } from 'react';
import { Button, DialogActions } from '@material-ui/core';
import { AppContext } from '../../AppContext';
import { Dialog, DialogTitle } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import { useDialogs } from '../dialog/useDialogs';
import { useBruteForce } from './useBruteForce';
import DialogContentText from '@material-ui/core/DialogContentText';

export interface IBruteConsentProps {
    run: Function;
}

function BruteForceConsent({ run }: IBruteConsentProps) {
    const { state } = useContext(AppContext);
    const { toggleBruteConsent } = useDialogs();
    const { getBruteChangedForm } = useBruteForce();
    const { amount } = getBruteChangedForm();
    const consentText = `You are about to run brute force with ${amount} permutations`;

    return (
        <Dialog onClose={() => toggleBruteConsent(false)} open={state.dialogs.bruteConsent}>
            <DialogTitle> Brute Force </DialogTitle>
            <DialogContent>
                <DialogContentText>{consentText}</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    className="NoCapsButton"
                    variant={'outlined'}
                    color="primary"
                    onClick={() => {
                        toggleBruteConsent(false);
                        run();
                    }}
                >
                    Run
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default BruteForceConsent;
