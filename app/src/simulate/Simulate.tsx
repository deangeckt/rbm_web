import React, { useContext } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { run, read } from '../api/api';
import { AppContext } from '../AppContext';
import SimulateMainForm from './form/SimulateMainForms';
import InfoDialog from './dialogs/InfoDialog';
import SimulatePanel from './SimulatePanel';
import SimulateCanvas from './SimulateCanvas';
import { IPlotData, mpObj } from '../Wrapper';
import ReadLoading from '../anim/ReadLoading';
import { useSimulate } from './useSimulate';
import Summary from './summary/Summary';
import { usePlot } from './plot/usePlot';
import Plot from './plot/Plot';
import TreeCanvasAnimated from '../tree/TreeCanvasAnimated';
import './Simulate.css';

export type TreeOrPlot = 'Tree' | 'Plot' | 'TreeAnim';
const initTreePlot: TreeOrPlot = 'Tree';

function Simulate() {
    const { state, setState } = useContext(AppContext);
    const { getChangedForm } = useSimulate();
    const { pushPlot } = usePlot();

    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [readLoading, setReadLoading] = React.useState(true);
    const [treeOrPlot, setTreeOrPlot] = React.useState(initTreePlot);

    const updatePlotData = (newData: IPlotData[]) => {
        pushPlot(newData);
        setRunning(false);
    };

    const updateError = (err: string) => {
        setError(err);
        setRunning(false);
    };

    const StartRunning = () => {
        setRunning(true);
        const { globalMechanism, sections } = getChangedForm();
        run(updatePlotData, updateError, globalMechanism, sections);
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
                                {treeOrPlot === 'TreeAnim' ? <TreeCanvasAnimated /> : null}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Simulate;
