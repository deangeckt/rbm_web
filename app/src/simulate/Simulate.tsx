import React, { useContext } from 'react';
import Plot from './Plot';
import './Simulate.css';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { root_id } from '../design/Design';
import DesignCanvas from '../design/DesignCanvas';
import { run } from '../api/api';
import { AppContext } from '../Contexts/AppContext';
import SimulateTabs from './SimulateTabs';

export interface IData {
    plot: number[][];
    name: string;
}

const init_data: IData = {
    plot: [],
    name: 'Soma',
};

function Simulate() {
    const { state } = useContext(AppContext);

    // simulate props
    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(init_data);

    // dialog - tooltip props
    const [dialogState, setDialogState] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState('');

    const updateData = (newData: number[][]) => {
        setData({ ...data, plot: newData });
        setLoading(false);
    };

    const updateError = (err: string) => {
        setError(err);
        setLoading(false);
        setRunning(false);
    };

    const toggleRunning = () => {
        // TODO: validate all inputs exist here OR input should not be empty..
        setRunning(!running);
        if (!running) {
            setLoading(true);
            run(updateData, updateError, state.inputs);
        } else {
            updateData([[]]);
        }
    };

    const closeError = (_event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setError('');
    };

    const updateDialog = (id: string) => {
        const currInput = state.inputs.find((ele) => ele.id === id);
        if (!currInput) return;

        const title = currInput.tooltipTitle;
        setDialogTitle(title);
        setDialogState(true);
    };

    return (
        <div className="Simulate">
            {loading ? <div>Loading</div> : null}
            <Dialog onClose={() => setDialogState(false)} open={dialogState}>
                <DialogTitle> {dialogTitle} </DialogTitle>
            </Dialog>
            <Snackbar open={error !== ''} autoHideDuration={6000} onClose={closeError}>
                <Alert variant="outlined" severity="error" onClose={closeError}>
                    {error}
                </Alert>
            </Snackbar>

            <div className="SimulateContainer">
                <div className="LeftSide">
                    <div className="SimulatePanel">
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => toggleRunning()}
                            startIcon={<PlayArrowIcon />}
                        >
                            {!running ? 'Start' : 'Reset'}
                        </Button>
                    </div>
                    <SimulateTabs updateDialog={updateDialog} />
                </div>
                <div className="RightSide">
                    <div className="Plot">
                        <Plot data={[data]} />
                    </div>
                    <div className="Graph" id={'Canvas'}>
                        <DesignCanvas selectedId={root_id} setSelectedId={() => null} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Simulate;
