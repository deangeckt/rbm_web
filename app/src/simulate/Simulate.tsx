import React, { useContext } from 'react';
import Plot from './Plot';
import './Simulate.css';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import DesignCanvas from '../design/DesignCanvas';
import { run } from '../api/api';
import { AppContext } from '../Contexts/AppContext';
import SimulateTabs from './SimulateTabs';
import { useSimulate } from './useSimulate';
import AddIcon from '@material-ui/icons/Add';
import { none_selected } from '../Wrapper';

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
    const { addStim } = useSimulate();

    // simulate props
    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(init_data);

    // dialog props
    const [dialogInfo, setDialogInfo] = React.useState(false);
    const [dialogChoise, setDialogChoise] = React.useState(false);
    const [dialogInfoTitle, setDialogInfoTitle] = React.useState('');
    const [tab, setTab] = React.useState(0);

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

    const updateDialogInfo = (id: string) => {
        const currInput = state.inputs.find((ele) => ele.id === id);
        if (!currInput) return;

        const title = currInput.tooltipTitle;
        setDialogInfoTitle(title);
        setDialogInfo(true);
    };

    React.useEffect(() => {
        if (state.selectedId != none_selected) {
            setDialogChoise(true);
        }
    }, [state.selectedId]);

    return (
        <div className="Simulate">
            {loading ? <div>Loading</div> : null}
            <Dialog onClose={() => setDialogInfo(false)} open={dialogInfo}>
                <DialogTitle> {dialogInfoTitle} </DialogTitle>
            </Dialog>
            <Dialog onClose={() => setDialogChoise(false)} open={dialogChoise}>
                <Button
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        addStim();
                        setDialogChoise(false);
                        setTab(1);
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
                        setDialogChoise(false);
                        setTab(2);
                    }}
                    startIcon={<AddIcon />}
                >
                    Add New Recording
                </Button>
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
                    <SimulateTabs updateDialogInfo={updateDialogInfo} tab={tab} setTab={setTab} />
                </div>
                <div className="RightSide">
                    <div className="Plot">
                        <Plot data={[data]} />
                    </div>
                    <div className="Graph" id={'Canvas'}>
                        <DesignCanvas />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Simulate;
