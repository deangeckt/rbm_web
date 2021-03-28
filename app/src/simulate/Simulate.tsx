import React, { useEffect } from 'react';
import Forms from './Forms';
import Plot from './Plot';
import './Simulate.css';
// import update from 'immutability-helper';

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

function Simulate() {
      const [data, setData] = React.useState([[0, 0]])
      const [running, setRunning] = React.useState(initState.running);
      const [inputs, setInputs] = React.useState(initState.inputs);

      // works - state is updated. not sure its efficent.
      const updateInput = (idx: number, val: number) => {
            const updateInputs = [...inputs];
            updateInputs[idx].value = val;
            setInputs(updateInputs);
      }

      useEffect(() => {
            if (!running) {
                  console.log(inputs)
                  return;
            }
            const interval = setInterval(() => {
                  let copy = [...data];
                  copy.push([copy[copy.length - 1][0] + 1, Math.random() * -5])
                  setData(copy);

            }, 100);
            return () => clearInterval(interval);
      }, [data, inputs, running]);

	return (
	      <div className="Simulate">
                  <div className="Container">
                        <div className="LeftSide">
                              <div className="LeftSideTop">
                                    <Plot data={[{data: data, name: 'A'}]}/>
                              </div>
                              <div className="LeftSideBottom">
                                    <Forms setRunning={setRunning} inputs={inputs} updateInput={updateInput}/>
                              </div>
                        </div>
                        <div className="RightSide">
                              right side
                        </div>
                  </div>
		</div>
  );
}

export default Simulate;
