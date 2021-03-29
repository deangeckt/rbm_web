import React, { useCallback, useEffect } from 'react';
import { Engine } from '../engine/Engine';
import Forms from './Forms';
import Plot from './Plot';
import './Simulate.css';
import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
export interface IData {
      data: number[][];
      name: string;
}

export interface IFormInput {
      name: string;
      value: number;
      tooltip: string;
}
export interface ISimulationState {
      running: boolean;
      inputs: IFormInput[]
}

const initState: ISimulationState = {
      running: false,
      inputs: [
            {
                  name: 'p1',
                  value: 0.5,
                  tooltip: 'p1 explained',
            },
            {
                  name: 'p2',
                  value: 1.5,
                  tooltip: 'p2 explained',
            }
      ]
}

// TODO:
// a. update engine params on the run in a more convient way - using keys maybe?
// b. maybe init the state here with engine state - no need to hold the init config twice.
// c. don't await engine to finish run() -
//    rather render the data that is already ready.
// d. support multiple data[][] arrays / plots retrived from engine

function Simulate() {
      const [data, setData] = React.useState([[0, 0]])
      const [running, setRunning] = React.useState(initState.running);
      const [inputs, setInputs] = React.useState(initState.inputs);

      const toggleRunning = () => {
            console.log('running ', running);
            setRunning(!running);
      }

      // works - state is updated. not sure its efficent.
      const updateInput = (idx: number, val: number) => {
            const updateInputs = [...inputs];
            updateInputs[idx].value = val;
            setInputs(updateInputs);
      }

      const runEngine = useCallback(
            async () => {
                  const engine = new Engine();
                  engine.param1 = inputs[0].value;
                  console.log('running engine');
                  setData(await engine.run());
            },
            [inputs],
      );

      useEffect(() => {
            if (running) {
                  runEngine()
            }

      }, [runEngine, running]);


	return (
      <div className="Simulate">
            <div className="Container">
                  <div className="LeftSide">
                  <div className="ControlPanel">
                        {!running ?
			      <Button variant="outlined" color="primary" onClick={() => toggleRunning()} startIcon={<PlayArrowIcon />}>Start</Button> :
                        <Button variant="outlined" color="primary" onClick={() => toggleRunning()} startIcon={<StopIcon />}>Stop</Button>
                        }
		      </div>
                        <Forms inputs={inputs} updateInput={updateInput}/>
                  </div>
                  <div className="RightSide">
                        <div className="Plot">
                              <Plot data={[{data: data, name: 'A'}]}/>
                        </div>
                        <div className="Graph">
                              3D
                        </div>
                  </div>
            </div>
      </div>
  );
}

export default Simulate;
