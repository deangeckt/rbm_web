import React, { useContext } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { run, read, bruteForce } from '../api/api';
import { AppContext } from '../AppContext';
import SimulateMainForm from './form/SimulateMainForms';
import InfoDialog from './dialog/InfoDialog';
import SimulatePanel from './SimulatePanel';
import SimulateCanvas from './SimulateCanvas';
import { IAnimData, IAttr, IBruteResult, IPlotPayload, none_selected_key, singleAttrObj } from '../Wrapper';
import ReadLoading from '../anim/ReadLoading';
import { useSimulate } from './useSimulate';
import Summary from './summary/Summary';
import Plot from './plot/Plot';
import TreeCanvasAnimated from '../tree/animate/TreeCanvasAnimated';
import { useSimulateCanvas } from '../tree/useSimulateCanvas';
import { useTreeText } from '../tree/useTreeText';
import FreeHandPlot from './brute/FreeHandPlot';
import BruteForcePanel from './brute/BruteForcePanel';
import { MuiThemeProvider } from '@material-ui/core/styles';
import BruteResults from './brute/BruteResults';
import './Simulate.css';

export type toggleType = 'Tree' | 'Plot' | 'Anim' | 'FreeHand';
const toggle_init: toggleType = 'Tree';

function Simulate() {
    const { state, setState } = useContext(AppContext);
    const { getChangedForm, getBruteChangedForm } = useSimulate();
    const { setSimulationTreeSections } = useSimulateCanvas();
    const { sectionsToTreeRender } = useTreeText();
    // console.log(state.bruteGlobalMechanism);

    const [error, setError] = React.useState('');
    const [running, setRunning] = React.useState(false);
    const [blockLoading, setBlockLoading] = React.useState(true);
    const [toggle, setToggle] = React.useState(toggle_init);

    const updateRunData = (plotData: IPlotPayload, animData: Record<string, IAnimData[]>) => {
        const plots = [...state.plots];
        plots.push(plotData);
        if (plots.length > 5) plots.shift();
        setState({ ...state, plots: plots, animations: JSON.parse(JSON.stringify(animData)) });
        setRunning(false);
    };

    const updateError = (err: string) => {
        setError(err);
        setRunning(false);
        setBlockLoading(false);
    };

    const simulateRun = () => {
        setRunning(true);
        const { globalMechanism, sections } = getChangedForm();
        run(updateRunData, updateError, globalMechanism, sections, state.addAnims);
    };

    const updateBruteData = (res: IBruteResult[]) => {
        setState({ ...state, bruteResults: JSON.parse(JSON.stringify(res)), bruteResultsShow: true });
        setBlockLoading(false);
    };

    const bruteForceRun = (draw: number[], section: string, segment: number, time: number) => {
        setBlockLoading(true);
        const { globalMechanism, sections } = getChangedForm(false, true);

        if (!sections[section])
            sections[section] = { id: section, records: {}, mechanism: {}, process: {}, general: {} };
        sections[section].records[segment] = [0];

        if (!globalMechanism['general']) globalMechanism['general'] = { attrs: {} };
        globalMechanism['general'].attrs['sim_time'] = time;

        const { bruteGlobalMechanism, bruteSections } = getBruteChangedForm();
        bruteForce(updateBruteData, updateError, globalMechanism, sections, bruteGlobalMechanism, bruteSections, draw);
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
        const staticGloablMech = { ...state.globalMechanism };
        Object.entries(sectionGeneral).forEach(([sec_key, attr]) => {
            if (sections[sec_key]) sections[sec_key].general = attr;
        });
        const treeText = sectionsToTreeRender(sections);

        setState({
            ...state,
            globalMechanism: Object.assign({}, staticGloablMech, newGlobalMech) as singleAttrObj,
            pointMechanism: newPointMech,
            pointProcess: newPointProc,
            sections: sections,
            sectionsTreeText: treeText,
            selectedId: none_selected_key,
        });
        setBlockLoading(false);
    };

    React.useEffect(() => {
        read(updateError, updateSimulation);
    }, []);

    return (
        <MuiThemeProvider theme={state.theme}>
            <div className="Simulate">
                {blockLoading ? (
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

                        {state.bruteResultsShow ? (
                            <BruteResults />
                        ) : (
                            <div className="SimulateContainer">
                                <div className="SimulateTopPanel">
                                    {!state.bruteForceMode && (
                                        <SimulatePanel
                                            running={running}
                                            start={simulateRun}
                                            onErr={updateError}
                                            toggle={toggle}
                                            setToggle={setToggle}
                                        />
                                    )}
                                    {state.bruteForceMode && <BruteForcePanel toggle={toggle} setToggle={setToggle} />}
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
                                        {state.bruteForceMode && (
                                            <FreeHandPlot display={toggle === 'FreeHand'} run={bruteForceRun} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MuiThemeProvider>
    );
}

export default Simulate;
