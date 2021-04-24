import React, { useContext } from 'react';
import Plot from './Plot';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { run, read } from '../api/api';
import { AppContext } from '../AppContext';
import SimulateMainForm from './SimulateMainForms';
import InfoDialog from './dialogs/InfoDialog';
import SimulatePanel from './SimulatePanel';
import SimulateCanvas from './SimulateCanvas';
import { IMechanismProcess } from '../Wrapper';
import ReadLoading from '../anim/ReadLoading';
import './Simulate.css';
import { useSimulate } from './useSimulate';

export interface IPlotData {
    plot: number[];
    name: string;
}

export type TreeOrPlot = 'Tree' | 'Plot';
const initTreePlot: TreeOrPlot = 'Tree';

function Simulate() {
    const { state, setState } = useContext(AppContext);
    const { getParamsForRun } = useSimulate();

    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [readLoading, setReadLoading] = React.useState(true);
    const [plotData, setPlotData] = React.useState([] as IPlotData[]);
    const [treeOrPlot, setTreeOrPlot] = React.useState(initTreePlot);

    const updatePlotData = (newData: IPlotData[]) => {
        setPlotData(newData);
        setRunning(false);
    };

    const updateDynForms = (
        newPointMech: Record<string, IMechanismProcess>,
        newGlobalMech: Record<string, IMechanismProcess>,
        newPointProcc: Record<string, IMechanismProcess>,
    ) => {
        const staticGloablMech = { ...state.globalMechanism };
        setState({
            ...state,
            globalMechanism: Object.assign({}, staticGloablMech, newGlobalMech) as Record<string, IMechanismProcess>,
            pointMechanism: newPointMech,
            pointProcess: newPointProcc,
        });
        setReadLoading(false);
    };

    const updateError = (err: string) => {
        setError(err);
        setRunning(false);
    };

    const StartRunning = () => {
        setPlotData([] as IPlotData[]);
        setRunning(true);
        const { globalMechanism, sections } = getParamsForRun();
        run(updatePlotData, updateError, globalMechanism, sections);
    };

    const closeError = (_event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setError('');
    };

    React.useEffect(() => {
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
                        <div className="SimulateTopPanel">
                            <SimulatePanel
                                running={running}
                                start={StartRunning}
                                toggle={treeOrPlot}
                                togglePlotTree={setTreeOrPlot}
                            />
                        </div>
                        <div className="SimulateCenter">
                            <div className="LeftSide">
                                <SimulateMainForm />
                            </div>
                            <div className="RightSide">
                                <SimulateCanvas display={treeOrPlot === 'Tree'} />
                                <Plot data={plotData} display={treeOrPlot === 'Plot'} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Simulate;
