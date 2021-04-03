import React, { useContext } from 'react';
import Forms from './Forms';
import Plot from './Plot';
import './Simulate.css';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import StopIcon from '@material-ui/icons/Stop';
import { default_neuron_rad, ILine, root_id } from '../design/Design';
import DesignCanvas from '../design/DesignCanvas';
import { AppContext } from '../Contexts/AppContext'
import axios, { AxiosResponse } from 'axios';

export interface IData {
      data: number[][];
      name: string;
}

const init_data: IData = {
	data: [],
	name: 'Soma'
}

export interface IFormInput {
      name: string;
      value: number;
      tooltipTitle: string;
      group?: number;
      // TODO: add tooltip explained / forumla / image
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

function Simulate(props: any) {

      const {state, setState} = useContext(AppContext);
      // canvas props
      const init_lines = props.history.location.state.lines ?? [];
	const init_neuron_rad = props.history.location.state.neuronRadius ?? default_neuron_rad;
	const [renderLines] = React.useState(init_lines as ILine[]);
	const [neuronRad] = React.useState(init_neuron_rad as number);

      // simulate props
      const [data, setData] = React.useState(init_data.data);
      const [error, setError] = React.useState(false);
      const [running, setRunning] = React.useState(false);
      const [inputs, setInputs] = React.useState(initInputs);

      // dialog - tooltip props
      const [dialogState, setDialogState] = React.useState(false);
      const [dialogTitle, setDialogTitle] = React.useState('');

      const postRequest = () => {
            axios.request({
                  url: 'http://localhost:8080/api/v1/run',
                  method: 'POST',
                  params: {bla: 'bla'}
            }).then((response: AxiosResponse) => {
                  const t = response.data['time'] as number[];
                  const v = response.data['volt'] as number[];
                  const r = [];
                  for (var i = 0 ; i<t.length; i++)
                        r.push([ t[i], v[i]]);
                  setData(r);
            });
      }

      const toggleRunning = () => {
            // TODO: validate all inputs exist here OR input should not be empty..
            setRunning(!running);
            if (!running) {
				// const result = run();
				postRequest();
				// axios.post('http://localhost:8080/api/v1/run', {}, options)
				// .then((response: AxiosResponse) => {
				// 	const t = response.data['time'] as number[];
				// 	const v = response.data['volt'] as number[];
				// 	const r = [];
				// 	for (var i = 0 ; i<t.length; i++)
				// 		r.push([ t[i], v[i]]);
				// 	setData(r);
				// }).catch((_error: AxiosError) => {
				// 	console.log('err');
				// });
            } else {
				setData(init_data.data);
                        setState({...state, data: {}})
			}
      }

      const closeError = (_event?: React.SyntheticEvent, reason?: string) => {
            if (reason === 'clickaway') {
                  return;
            }
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
            <h1 onClick={()=>setState({
                  ...state,
                  fname: 'Moshe'
            })}>{state.fname}</h1>
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
                              <Plot data={[{data: data, name: 'A'}]}/>
                        </div>
                        <div className="Graph" id={"Canvas"}>
                              <DesignCanvas lines={renderLines} neuronRad={neuronRad}
                                          selectedId={root_id}
                                          setSelectedId={() => null}/>
                        </div>
                  </div>
            </div>
      </div>
  );
}

export default Simulate;
