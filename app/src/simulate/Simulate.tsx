import React, { useEffect } from 'react';
import Forms from './Forms';
import Plot from './Plot';
import './Simulate.css';

export interface IData {
      data: number[][];
      name: string;
}
export interface ISimulationState {
      running: boolean;
      p1: number;
      p2: number;
}

function Simulate() {
      const [data, setData] = React.useState([[0, 0]])

      const initState: ISimulationState = {
            running: false,
            p1: 1.5,
            p2: 0.5
      }
      const [state, setState] = React.useState(initState);


      useEffect(() => {
            if (!state.running) {
                  return;
            }
            const interval = setInterval(() => {
                  let copy = [...data];
                  copy.push([copy[copy.length - 1][0] + 1, Math.random() * -5])
                  setData(copy);

            }, 100);
            return () => clearInterval(interval);
      }, [data, state.running]);

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
