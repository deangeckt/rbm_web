import React, { useContext } from 'react';
import { Dialog, DialogTitle, Button, DialogActions, Checkbox, FormControlLabel } from '@material-ui/core';
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

    return (
        <Dialog onClose={() => toggleExport(false)} open={state.dialogs.exportState}>
            <DialogTitle> Export session params </DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={<Checkbox color="primary" checked={check} onChange={() => setCheck(!check)} />}
                    label={'Include sections process and recordings'}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    className="NoCapsButton"
                    variant={'outlined'}
                    color="primary"
                    onClick={() => {
                        const { globalMechanism, sections } = getChangedForm(!check);
                        downloadJsonParams(globalMechanism, sections);
                    }}
                >
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ExportSeassionDialog;
