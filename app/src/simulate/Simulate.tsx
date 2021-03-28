import React, { useEffect } from 'react';
import Forms from './Forms';
import Plot from './Plot';
import './Simulate.css';

export interface IData {
      data: number[][];
      name: string;
}

export interface IFormInput {
      name: string;
      value: number;
      tooltip: string;
      update: Function;
}
export interface ISimulationState {
      running: boolean;
      inputs: IFormInput[]
}

function Simulate() {
      const [data, setData] = React.useState([[0, 0]])

      const initState: ISimulationState = {
            running: false,
            inputs: [
                  {
                        name: 'p1',
                        value: 0.5,
                        tooltip: 'p1 explained',
                        update: (v: number) => ({value: v}) // doesnt update
                  },
                  {
                        name: 'p2',
                        value: 1.5,
                        tooltip: 'p2 explained',
                        update: (v: number) => v // doesnt update
                  }
            ]
      }
      const [state, setState] = React.useState(initState);


      useEffect(() => {
            if (!state.running) {
                  console.log(state.inputs)
                  return;
            }
            const interval = setInterval(() => {
                  let copy = [...data];
                  copy.push([copy[copy.length - 1][0] + 1, Math.random() * -5])
                  setData(copy);

            }, 100);
            return () => clearInterval(interval);
      }, [data, state.inputs, state.running]);

	return (
	      <div className="Simulate">
                  <div className="Container">
                        <div className="LeftSide">
                              <div className="LeftSideTop">
                                    <Plot data={[{data: data, name: 'A'}]}/>
                              </div>
                              <div className="LeftSideBottom">
                                    <Forms setSimulationState={setState} simulationState={state}/>
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
