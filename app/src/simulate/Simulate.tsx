import React, { useEffect } from 'react';
import Forms from './Forms';
import Plot from './Plot';
import './Simulate.css';

export interface IData {
      data: number[][];
      name: string;
}

function Simulate() {
      const [data, setData] = React.useState([[0, 0]])
      const [data2, setData2] = React.useState([[0, 0]])

      useEffect(() => {
            const interval = setInterval(() => {
                  let copy = [...data];
                  copy.push([copy[copy.length - 1][0] + 1, Math.random() * -5])
                  setData(copy);

                  let copy2 = [...data2];
                  copy2.push([copy2[copy2.length - 1][0] + 1, Math.random() * 5])
                  setData2(copy2);
            }, 100);
            return () => clearInterval(interval);
      }, [data, data2]);

	return (
	      <div className="Simulate">
                  <Plot data={[{data: data, name: 'A'}, {data: data2, name: 'B'}]}/>
                  <Forms />
		</div>
  );
}

export default Simulate;
