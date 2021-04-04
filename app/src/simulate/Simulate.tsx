import React from 'react';
import Forms from './Forms';
import Plot from './Plot';
import './Simulate.css';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import StopIcon from '@material-ui/icons/Stop';
import { root_id } from '../design/Design';
import DesignCanvas from '../design/DesignCanvas';
import { run } from '../api/api';
import config from '../share/config.json';

export interface IFormInput {
    name: string;
    value: any;
    tooltipTitle: string;
    id: string;
    group?: number;
    // TODO: add tooltip explained / forumla / image
}

export interface IData {
    plot: number[][];
    name: string;
}

const init_data: IData = {
    plot: [],
    name: 'Soma',
};

export const init_form = config.default_form as ReadonlyArray<IFormInput>;

function Simulate() {
    // simulate props
    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [inputs, setInputs] = React.useState(JSON.parse(JSON.stringify(init_form)) as IFormInput[]);
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
            run(updateData, updateError, inputs);
        } else {
            updateData([[]]);
        }
    };

    const closeError = (_event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setError('');
    };

    const updateDialog = (id: string) => {
        const currInput = inputs.find((ele) => ele.id === id);
        if (!currInput) return;

        const title = currInput.tooltipTitle;
        setDialogTitle(title);
        setDialogState(true);
    };

    const updateInput = (id: string, val: number) => {
        const updateInputs = [...inputs];
        const currInput = updateInputs.find((ele) => ele.id === id);
        if (!currInput) return;

        currInput.value = val;
        setInputs(updateInputs);
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
                        {!running ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => toggleRunning()}
                                startIcon={<PlayArrowIcon />}
                            >
                                Start
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => toggleRunning()}
                                startIcon={<StopIcon />}
                            >
                                Stop
                            </Button>
                        )}
                    </div>
                    <Forms inputs={inputs} updateInput={updateInput} openTooltip={updateDialog} />
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
