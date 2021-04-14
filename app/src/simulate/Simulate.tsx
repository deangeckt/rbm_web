import React, { useContext } from 'react';
import Plot from './Plot';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { run, read } from '../api/api';
import { AppContext } from '../Contexts/AppContext';
import SimulateTabs from './SimulateTabs';
import InfoDialog from './Dialogs/InfoDialog';
import SimulatePanel from './SimulatePanel';
import { useSimulate } from './useSimulate';
import SimulateCanvas from './SimulateCanvas';
import './Simulate.css';

export interface IData {
    plot: number[];
    name: string;
}

const init_data: IData[] = [];
function Simulate() {
    const { state } = useContext(AppContext);
    const { setSimulationTreeCids } = useSimulate();

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

    React.useEffect(() => {
        setSimulationTreeCids();
        // read(updateError, updateDynForms);
        // setLoading(true);
    }, []);

    return (
        <div className="Simulate">
            {loading ? <div>Loading</div> : null}
            <InfoDialog />
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
                    <div className="SimulateCanvas">
                        <SimulateCanvas setTab={setTab} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Simulate;
