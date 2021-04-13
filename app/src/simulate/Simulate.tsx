import React, { useContext } from 'react';
import Plot from './Plot';
import './Simulate.css';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import DesignCanvas from '../design/DesignCanvas';
import { run } from '../api/api';
import { AppContext } from '../Contexts/AppContext';
import SimulateTabs from './SimulateTabs';
import { none_selected } from '../Wrapper';
import InfoDialog from './Dialogs/InfoDialog';
import NewFormDialog from './Dialogs/NewFormDialog';
import { useDialogs } from './Dialogs/useDialogs';
import SimulatePanel from './SimulatePanel';

export interface IData {
    plot: number[];
    name: string;
}

const init_data: IData[] = [];
function Simulate() {
    const { state } = useContext(AppContext);
    const { setDialogNewForm } = useDialogs();

    // simulate props
    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(init_data);
    const [tab, setTab] = React.useState(0);

    const updateData = (newData: IData[]) => {
        setData(newData);
        setLoading(false);
    };

    const updateError = (err: string) => {
        setError(err);
        setLoading(false);
        setRunning(false);
    };

    const toggleRunning = () => {
        setRunning(!running);
        if (!running) {
            setLoading(true);
            run(updateData, updateError, state.inputs, state.stims, state.records);
        } else {
            updateData([]);
        }
    };

    const closeError = (_event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setError('');
    };

    const newStimRecord = (tab_id: number) => {
        setDialogNewForm(false);
        setTab(tab_id);
    };

    React.useEffect(() => {
        if (state.selectedId != none_selected) {
            console.log('new id');
            setDialogNewForm(true);
        }
    }, [state.selectedId]);

    return (
        <div className="Simulate">
            {loading ? <div>Loading</div> : null}
            <InfoDialog />
            <NewFormDialog newStimRecord={newStimRecord} />
            <Snackbar open={error !== ''} autoHideDuration={6000} onClose={closeError}>
                <Alert variant="outlined" severity="error" onClose={closeError}>
                    {error}
                </Alert>
            </Snackbar>

            <div className="SimulateContainer">
                <div className="LeftSide">
                    <div className="SimulatePanel">
                        <SimulatePanel running={running} toggleRunning={toggleRunning} />
                    </div>
                    <SimulateTabs tab={tab} setTab={setTab} />
                </div>
                <div className="RightSide">
                    <div className="Plot">
                        <Plot data={data} />
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
