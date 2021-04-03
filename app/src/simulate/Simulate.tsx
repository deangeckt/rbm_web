import React from 'react';
import Forms from './Forms';
import Plot from './Plot';
import './Simulate.css';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import StopIcon from '@material-ui/icons/Stop';
import { root_id } from '../design/Design';
import DesignCanvas from '../design/DesignCanvas';
import { run } from '../api/api';

export interface IFormInput {
      name: string;
      value: number;
      tooltipTitle: string;
      group?: number;
      // TODO: add tooltip explained / forumla / image
}

export interface IData {
    plot: number[][];
    name: string;
}

const init_data: IData = {
	plot: [],
	name: 'Soma'
}


const initInputs: IFormInput[] = [
{
      name: 'p1',
      value: 0.5,
      tooltipTitle: 'p1 explained',
      group: 1,
},
{
      name: 'p2',
      value: 1.5,
      tooltipTitle: 'p2 explained',
      group: 1,
},
{
      name: 'long param name [Kg]',
      value: 1.5,
      tooltipTitle: 'long param namelong param namelong param namelong param namelong param namelong param namelong param namelong param namelong param namelong param name',
},
{
      name: 'p9',
      value: 0.5,
      tooltipTitle: 'p9 explained',
      group:1,
},
{
      name: 'p8',
      value: 1.5,
      tooltipTitle: 'p8 explained',
      group:1,
},
{
      name: 'p1',
      value: 0.5,
      tooltipTitle: 'p1 explained',
},
{
      name: 'p2',
      value: 1.5,
      tooltipTitle: 'p2 explained',
},
{
      name: 'long param name [Kg]',
      value: 1.5,
      tooltipTitle: 'long param namelong param namelong param namelong param namelong param namelong param namelong param namelong param namelong param namelong param name',
},
{
      name: 'p9',
      value: 0.5,
      tooltipTitle: 'p9 explained',
},
{
      name: 'p8',
      value: 1.5,
      tooltipTitle: 'p8 explained',
},
{
      name: 'p2',
      value: 1.5,
      tooltipTitle: 'p2 explained',
},
{
      name: 'long param name [Kg]',
      value: 1.5,
      tooltipTitle: 'long param namelong param namelong param namelong param namelong param namelong param namelong param namelong param namelong param namelong param name',
},
{
      name: 'p9',
      value: 0.5,
      tooltipTitle: 'p9 explained',
},
{
      name: 'p8',
      value: 1.5,
      tooltipTitle: 'p8 explained',
},

]

function Simulate() {
	// simulate props
	const [error, setError] = React.useState(false);
	const [running, setRunning] = React.useState(false);
	const [inputs, setInputs] = React.useState(initInputs);
	const [data, setData] = React.useState(init_data);

	// dialog - tooltip props
	const [dialogState, setDialogState] = React.useState(false);
	const [dialogTitle, setDialogTitle] = React.useState('');

	const updateData = (newData: number[][]) => {
		setData({...data, plot: newData});
	}

	const toggleRunning = () => {
		// TODO: validate all inputs exist here OR input should not be empty..
		setRunning(!running);
		if (!running) {
			run(updateData);
		} else {
			updateData([[]]);
		}
	}

	const closeError = (_event?: React.SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway')
				return;

		setError(false);
	};

	const updateDialog = (idx: number) => {
		const title = inputs[idx].tooltipTitle;
		setDialogTitle(title);
		setDialogState(true);
	}

	const updateInput = (idx: number, val: number) => {
		const updateInputs = [...inputs];
		updateInputs[idx].value = val;
		setInputs(updateInputs);
	}

	return (
      <div className="Simulate">
            <Dialog onClose={() => setDialogState(false)} open={dialogState}>
                  <DialogTitle > {dialogTitle} </DialogTitle>
            </Dialog>

            <Snackbar open={error} autoHideDuration={6000} onClose={closeError}>
                  <Alert variant="outlined" severity="error" onClose={closeError}>
                        This is an error alert — check it out!
                  </Alert>
            </Snackbar>

            <div className="SimulateContainer">
                  <div className="LeftSide">
                  <div className="SimulatePanel">
                        {!running ?
                        <Button variant="outlined" color="primary" onClick={() => toggleRunning()} startIcon={<PlayArrowIcon />}>Start</Button> :
                        <Button variant="outlined" color="primary" onClick={() => toggleRunning()} startIcon={<StopIcon />}>Stop</Button>
                        }
                  </div>
                        <Forms inputs={inputs} updateInput={updateInput} openTooltip={updateDialog}/>
                  </div>
                  <div className="RightSide">
                        <div className="Plot">
                              <Plot data={[data]}/>
                        </div>
                        <div className="Graph" id={"Canvas"}>
                              <DesignCanvas selectedId={root_id} setSelectedId={() => null}/>
                        </div>
                  </div>
            </div>
      </div>
  );
}

export default Simulate;
