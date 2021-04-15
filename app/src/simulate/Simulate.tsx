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
import { IMechanism } from '../Wrapper';
import './Simulate.css';
import ReadLoading from '../anim/ReadLoading';

export interface IPlotData {
    plot: number[];
    name: string;
}
function Simulate() {
    const { state, setState } = useContext(AppContext);
    const { setSimulationTreeCids } = useSimulate();

    // simulate props
    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [readLoading, setReadLoading] = React.useState(false);
    const [plotData, setPlotData] = React.useState([] as IPlotData[]);
    const [tab, setTab] = React.useState(0);

    const updatePlotData = (newData: IPlotData[]) => {
        setPlotData(newData);
        setRunning(false);
    };

    const updateDynForms = (newPointMech: IMechanism[], newGlobalMech: IMechanism[]) => {
        setState({ ...state, pointMechanism: newPointMech, globalMechanism: newGlobalMech });
        console.log(newPointMech);
        setReadLoading(false);
    };

    const updateError = (err: string) => {
        setError(err);
        setRunning(false);
    };

    const StartRunning = () => {
        setRunning(true);
        run(updatePlotData, updateError, state.inputs, state.stims, state.records);
    };

    const closeError = (_event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setError('');
    };

    React.useEffect(() => {
        setReadLoading(true);
        setSimulationTreeCids();
        read(updateError, updateDynForms);
    }, []);

    return (
        <div className="Simulate">
            {readLoading ? (
                <ReadLoading />
            ) : (
                <>
                    <InfoDialog />
                    <Snackbar open={error !== ''} autoHideDuration={6000} onClose={closeError}>
                        <Alert variant="outlined" severity="error" onClose={closeError}>
                            {error}
                        </Alert>
                    </Snackbar>

                    <div className="SimulateContainer">
                        <div className="LeftSide">
                            <div className="SimulatePanel">
                                <SimulatePanel running={running} start={StartRunning} />
                            </div>
                            <SimulateTabs tab={tab} setTab={setTab} />
                        </div>
                        <div className="RightSide">
                            <div className="Plot">
                                <Plot data={plotData} />
                            </div>
                            <div className="SimulateCanvas">
                                <SimulateCanvas setTab={setTab} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Simulate;
