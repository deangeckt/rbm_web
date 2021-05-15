import React, { useContext } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { run, read } from '../api/api';
import { AppContext } from '../AppContext';
import SimulateMainForm from './form/SimulateMainForms';
import InfoDialog from './dialogs/InfoDialog';
import SimulatePanel from './SimulatePanel';
import SimulateCanvas from './SimulateCanvas';
import { IAnimData, IPlotData, mpObj } from '../Wrapper';
import ReadLoading from '../anim/ReadLoading';
import { useSimulate } from './useSimulate';
import Summary from './summary/Summary';
import Plot from './plot/Plot';
import TreeCanvasAnimated from '../tree/animate/TreeCanvasAnimated';
import './Simulate.css';

export type TreeOrPlot = 'Tree' | 'Plot' | 'Anim';
const initTreePlot: TreeOrPlot = 'Tree';

function Simulate() {
    const { state, setState } = useContext(AppContext);
    const { getChangedForm } = useSimulate();
    console.log(state.animations);

    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [readLoading, setReadLoading] = React.useState(true);
    const [treeOrPlot, setTreeOrPlot] = React.useState(initTreePlot);

    const updateRunData = (plotData: IPlotData[], animData: Record<string, IAnimData[]>) => {
        console.log(animData);
        const plots = [...state.plots];
        plots.push(plotData);
        // anim = JSON.parse(JSON.stringify(animData));
        setState({ ...state, plots: plots, animations: animData });
        setRunning(false);
    };

    const updateError = (err: string) => {
        setError(err);
        setRunning(false);
    };

    const StartRunning = () => {
        setRunning(true);
        const { globalMechanism, sections } = getChangedForm();
        run(updateRunData, updateError, globalMechanism, sections, state.addAnims);
    };

    const closeError = (_event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setError('');
    };

    const updateDynForms = (newPointMech: mpObj, newGlobalMech: mpObj, newPointProcc: mpObj) => {
        const staticGloablMech = { ...state.globalMechanism };
        setState({
            ...state,
            globalMechanism: Object.assign({}, staticGloablMech, newGlobalMech) as mpObj,
            pointMechanism: newPointMech,
            pointProcess: newPointProcc,
        });
        setReadLoading(false);
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
                            <Summary />

                            <div className="LeftSide">
                                <SimulateMainForm />
                            </div>
                            <div className="RightSide">
                                <SimulateCanvas display={treeOrPlot === 'Tree'} />
                                <Plot display={treeOrPlot === 'Plot'} />
                                <TreeCanvasAnimated display={treeOrPlot === 'Anim'} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Simulate;
