import React, { useContext } from 'react';
import Plot from './Plot';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { run, read } from '../api/api';
import { AppContext } from '../AppContext';
import SimulateTabs from './SimulateTabs';
import InfoDialog from './dialogs/InfoDialog';
import SimulatePanel from './SimulatePanel';
import SimulateCanvas from './SimulateCanvas';
import { IMechanismProcess } from '../Wrapper';
import ReadLoading from '../anim/ReadLoading';
import './Simulate.css';

export interface IPlotData {
    plot: number[];
    name: string;
}

export type TreeOrPlot = 'Tree' | 'Plot';
const initTreePlot: TreeOrPlot = 'Tree';

function Simulate() {
    const { state, setState } = useContext(AppContext);
    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [readLoading, setReadLoading] = React.useState(true);
    const [plotData, setPlotData] = React.useState([] as IPlotData[]);
    const [treeOrPlot, setTreeOrPlot] = React.useState(initTreePlot);
    const [tab, setTab] = React.useState(0);

    const updatePlotData = (newData: IPlotData[]) => {
        setPlotData(newData);
        setRunning(false);
    };

    const updateDynForms = (
        newPointMech: IMechanismProcess[],
        newGlobalMech: IMechanismProcess[],
        newPointProcc: IMechanismProcess[],
    ) => {
        const staticGloablMech = [...state.globalMechanism];
        setState({
            ...state,
            globalMechanism: staticGloablMech.concat(newGlobalMech),
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
        setRunning(true);
        run(updatePlotData, updateError);
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
                                <SimulateTabs tab={tab} setTab={setTab} />
                            </div>
                            <div className="RightSide">
                                {treeOrPlot === 'Plot' ? <Plot data={plotData} /> : <SimulateCanvas />}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Simulate;
