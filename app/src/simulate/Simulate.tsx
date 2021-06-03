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
import Loading from '../anim/Loading';
import { useSimulate } from './useSimulate';
import Summary from './summary/Summary';
import Plot from './plot/Plot';
import TreeCanvasAnimated from '../tree/animate/TreeCanvasAnimated';
import { useSimulateCanvas } from '../tree/useSimulateCanvas';
import { useTreeText } from '../tree/useTreeText';
import FreeHandPlot from './brute/FreeHandPlot';
import BruteForcePanel from './brute/BruteForcePanel';
import BruteForceConsent from './brute/BruteForceConsent';
import { createStyles, makeStyles, MuiThemeProvider, Theme } from '@material-ui/core/styles';
import BruteResults from './brute/BruteResults';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { useBruteForce } from './brute/useBruteForce';
import './Simulate.css';

export type toggleType = 'Tree' | 'Plot' | 'Anim' | 'FreeHand';
const toggle_init: toggleType = 'Tree';

function Simulate() {
    const { state, setState } = useContext(AppContext);
    const { getChangedForm } = useSimulate();
    const { getBruteChangedForm } = useBruteForce();
    const { setSimulationTreeSections } = useSimulateCanvas();
    const { sectionsToTreeRender } = useTreeText();
    // console.log(state.bruteSections);

    const [error, setError] = React.useState('');
    const [reading, setReading] = React.useState(true);
    const [running, setRunning] = React.useState(false);
    const [bruting, setBruting] = React.useState(false);
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
        setBruting(false);
        setReading(false);
    };

    const simulateRun = () => {
        setRunning(true);
        const { globalMechanism, sections } = getChangedForm();
        run(updateRunData, updateError, globalMechanism, sections, state.addAnims);
    };

    const updateBruteData = (res: IBruteResult[]) => {
        const dialogs = { ...state.dialogs };
        dialogs.bruteResultsShow = true;
        dialogs.bruteConsent = false;
        setState({ ...state, bruteResults: JSON.parse(JSON.stringify(res)), dialogs: dialogs });
        setBruting(false);
    };

    const bruteForceSetConsent = (draw: number[], section: string, segment: number, time: number) => {
        const bruteInput = { ...state.bruteInput };
        const dialogs = { ...state.dialogs };
        dialogs.bruteConsent = true;

        bruteInput.plot = draw;
        bruteInput.section = section;
        bruteInput.segment = segment;
        bruteInput.time = time;
        setState({ ...state, dialogs: dialogs, bruteInput: bruteInput });
    };

    const bruteForceRun = () => {
        setBruting(true);

        const bruteInput = { ...state.bruteInput };
        const { globalMechanism, sections } = getChangedForm(false, true);

        if (!sections[bruteInput.section])
            sections[bruteInput.section] = {
                id: bruteInput.section,
                records: {},
                mechanism: {},
                process: {},
                general: {},
            };
        sections[bruteInput.section].records[bruteInput.segment] = [0];

        if (!globalMechanism['general']) globalMechanism['general'] = { attrs: {} };
        globalMechanism['general'].attrs['sim_time'] = bruteInput.time;

        const { bruteGlobalMechanism, bruteSections } = getBruteChangedForm();
        bruteForce(
            updateBruteData,
            updateError,
            globalMechanism,
            sections,
            bruteGlobalMechanism,
            bruteSections,
            bruteInput.plot,
        );
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
        setReading(false);
    };

    React.useEffect(() => {
        read(updateError, updateSimulation);
    }, []);

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            backdrop: {
                zIndex: theme.zIndex.drawer + 1,
                color: '#fff',
            },
        }),
    );

    const backDropClass = useStyles();

    return (
        <MuiThemeProvider theme={state.theme}>
            <div className="Simulate">
                {reading ? (
                    <Loading />
                ) : (
                    <>
                        <Backdrop open={bruting} className={backDropClass.backdrop}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <BruteResults />
                        <BruteForceConsent run={bruteForceRun} />
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
                                    <Plot display={toggle === 'Plot'} />

                                    {!state.bruteForceMode && <TreeCanvasAnimated display={toggle === 'Anim'} />}
                                    <FreeHandPlot
                                        display={state.bruteForceMode && toggle === 'FreeHand'}
                                        run={bruteForceSetConsent}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MuiThemeProvider>
    );
}

export default Simulate;
