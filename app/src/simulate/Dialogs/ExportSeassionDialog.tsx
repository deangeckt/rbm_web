import React, { useContext } from 'react';
import { Dialog, DialogTitle, Button, DialogActions, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { useDialogs } from './useDialogs';
import { AppContext } from '../../AppContext';
import DialogContent from '@material-ui/core/DialogContent';
import { downloadJsonParams } from '../../utils/general';
import { useSimulate } from '../useSimulate';

function ExportSeassionDialog() {
    const { toggleExport } = useDialogs();
    const { getChangedForm } = useSimulate();
    const { state } = useContext(AppContext);
    const [check, setCheck] = React.useState(false);
    const [desc, setDesc] = React.useState('');

    return (
        <Dialog onClose={() => toggleExport(false)} open={state.dialogs.exportState}>
            <DialogTitle> Export session params </DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={<Checkbox color="primary" checked={check} onChange={() => setCheck(!check)} />}
                    label={'Include sections process and recordings'}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Add description"
                    type="text"
                    fullWidth
                    onChange={(e) => setDesc(e.target.value)}
                    value={desc}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    className="NoCapsButton"
                    variant={'outlined'}
                    color="primary"
                    onClick={() => {
                        const { globalMechanism, sections } = getChangedForm(!check);
                        downloadJsonParams(globalMechanism, sections, desc);
                    }}
                >
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ExportSeassionDialog;
