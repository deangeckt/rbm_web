import React, { useContext } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { AppContext } from '../../AppContext';
import MechProcItem from '../summary/MechProcItem';
import SectionItem from '../summary/SectionItem';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { usePlots } from '../plot/usePlot';
import { iconSizeStyle } from '../../util/generalUtils';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Dialog, DialogTitle } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import { useDialogs } from '../dialog/useDialogs';
import './brute.css';

function BruteResults() {
    const { state } = useContext(AppContext);
    const { toggleBruteResults } = useDialogs();
    const { getPlotOptions } = usePlots();
    const [currIdx, setCurrIdx] = React.useState(0);
    const currResObj = state.bruteResults[currIdx];

    return (
        <Dialog fullScreen={true} onClose={() => toggleBruteResults(false)} open={state.dialogs.bruteResultsShow}>
            <DialogTitle> Brute Force Results </DialogTitle>
            <DialogContent>
                <div className="BruteResults">
                    <div className="BruteResultsPanel">
                        <IconButton
                            color="primary"
                            size="medium"
                            onClick={() => {
                                toggleBruteResults(false);
                            }}
                        >
                            <ArrowBackIcon style={iconSizeStyle} />
                        </IconButton>
                    </div>

                    <div className="BruteResultsContainer">
                        <div className="BruteResultsList">
                            {state.bruteResults.map((_brute_obj, idx) => {
                                return (
                                    <Button
                                        key={idx}
                                        className="NoCapsButton"
                                        variant={currIdx === idx ? 'contained' : 'outlined'}
                                        color="primary"
                                        onClick={() => setCurrIdx(idx)}
                                    >
                                        {idx}
                                    </Button>
                                );
                            })}
                        </div>
                        <div className="BruteResultsParams">
                            <div className="SummaryHeader">Global Mechanism</div>
                            {Object.entries(currResObj?.global ?? {}).map(([name, mech]) => {
                                return <MechProcItem key={name} id={name} item={mech} />;
                            })}
                            <div className="SummaryHeader">Sections</div>
                            {Object.values(currResObj?.sections ?? {}).map((sec, i) => {
                                return <SectionItem key={`${sec.id}_${i}`} section={sec} />;
                            })}
                        </div>
                        <div className="BruteResultsPlot">
                            {currResObj && (
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={getPlotOptions(currResObj.plot.volt, currResObj.plot.time, 'Voltage [mV]')}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default BruteResults;
