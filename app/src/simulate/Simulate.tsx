import React, { useContext } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { run, read } from '../api/api';
import { AppContext } from '../AppContext';
import SimulateMainForm from './form/SimulateMainForms';
import InfoDialog from './dialog/InfoDialog';
import SimulatePanel from './SimulatePanel';
import SimulateCanvas from './SimulateCanvas';
import { IAnimData, IAttr, IPlotPayload, none_selected_key, singleAttrObj } from '../Wrapper';
import ReadLoading from '../anim/ReadLoading';
import { useSimulate } from './useSimulate';
import Summary from './summary/Summary';
import Plot from './plot/Plot';
import TreeCanvasAnimated from '../tree/animate/TreeCanvasAnimated';
import { useSimulateCanvas } from '../tree/useSimulateCanvas';
import { useTreeText } from '../tree/useTreeText';
import FreeHandPlot from './brute/FreeHandPlot';
import './Simulate.css';
import BruteForcePanel from './brute/BruteForcePanel';

export type toggleType = 'Tree' | 'Plot' | 'Anim' | 'FreeHand';
const toggle_init: toggleType = 'Tree';

function Simulate() {
    const { state, setState } = useContext(AppContext);
    const { getChangedForm } = useSimulate();
    const { setSimulationTreeSections } = useSimulateCanvas();
    const { sectionsToTreeRender } = useTreeText();

    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [readLoading, setReadLoading] = React.useState(true);
    const [toggle, setToggle] = React.useState(toggle_init);

    const updateRunData = (plotData: IPlotPayload, animData: Record<string, IAnimData[]>) => {
        const plots = [...state.plots];
        plots.push(plotData);
        setState({ ...state, plots: plots, animations: JSON.parse(JSON.stringify(animData)) });
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

    const updateSimulation = (
        newPointMech: singleAttrObj,
        newGlobalMech: singleAttrObj,
        newPointProc: singleAttrObj,
        sectionGeneral: Record<string, IAttr>,
    ) => {
        const { sections } = setSimulationTreeSections();
        const treeText = sectionsToTreeRender(sections);

        const staticGloablMech = { ...state.globalMechanism };
        Object.entries(sectionGeneral).forEach(([sec_key, attr]) => {
            sections[sec_key].general = attr;
        });

        setState({
            ...state,
            globalMechanism: Object.assign({}, staticGloablMech, newGlobalMech) as singleAttrObj,
            pointMechanism: newPointMech,
            pointProcess: newPointProc,
            sections: sections,
            sectionsTreeText: treeText,
            selectedId: none_selected_key,
        });
        setReadLoading(false);
    };

    React.useEffect(() => {
        read(updateError, updateSimulation);
    }, []);

    return (
        <div className="Simulate">
            {readLoading ? (
                <ReadLoading />
            ) : (
                <>
                    <InfoDialog />
                    <Summary />
                    <Snackbar open={error !== ''} autoHideDuration={6000} onClose={closeError}>
                        <Alert variant="outlined" severity="error" onClose={closeError}>
                            {error}
                        </Alert>
                    </Snackbar>

                    <div className="SimulateContainer">
                        <div className="SimulateTopPanel">
                            {!state.bruteForceMode && (
                                <SimulatePanel
                                    running={running}
                                    start={StartRunning}
                                    onErr={updateError}
                                    toggle={toggle}
                                    setToggle={setToggle}
                                />
                            )}
                            {state.bruteForceMode && (
                                <BruteForcePanel
                                    running={false}
                                    start={() => null}
                                    toggle={toggle}
                                    setToggle={setToggle}
                                />
                            )}
                        </div>
                        <div className="SimulateCenter">
                            <div className="LeftSide">
                                <SimulateMainForm />
                            </div>
                            <div className="RightSide">
                                <SimulateCanvas display={toggle === 'Tree'} />
                                {!state.bruteForceMode && (
                                    <>
                                        <Plot display={toggle === 'Plot'} />
                                        <TreeCanvasAnimated display={toggle === 'Anim'} />
                                    </>
                                )}
                                {state.bruteForceMode && <FreeHandPlot display={toggle === 'FreeHand'} />}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Simulate;
