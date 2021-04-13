import React, { useContext } from 'react';
import { Button, Dialog } from '@material-ui/core';
import { useDialogs } from './useDialogs';
import { record_tab, stim_tab } from '../SimulateTabs';
import AddIcon from '@material-ui/icons/Add';
import { AppContext } from '../../Contexts/AppContext';
import { useSimulate } from '../useSimulate';

export interface INewFormDialogProps {
    newStimRecord: (tab_id: number) => void;
}

function NewFormDialog({ newStimRecord }: INewFormDialogProps) {
    const { setDialogNewForm } = useDialogs();
    const { state } = useContext(AppContext);
    const { addStim, addRecord } = useSimulate();

    return (
        <Dialog onClose={() => setDialogNewForm(false)} open={state.dialogs.dialogNewForm}>
            <Button
                className="NoCapsButton"
                variant="outlined"
                color="primary"
                onClick={() => {
                    // BUG HERE!
                    addStim();
                    // newStimRecord(stim_tab);
                }}
                startIcon={<AddIcon />}
            >
                Add New Stimulus
            </Button>
            <Button
                className="NoCapsButton"
                variant="outlined"
                color="primary"
                onClick={() => {
                    addRecord();
                    newStimRecord(record_tab);
                }}
                startIcon={<AddIcon />}
            >
                Add New Recording
            </Button>
        </Dialog>
    );
}

export default NewFormDialog;
