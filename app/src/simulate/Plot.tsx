import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

function randomData() {
    var data = []
    for (var i = 0; i < 50; i++) {
        var a = Math.floor(Math.random() * 10);
        var b = Math.floor(Math.random() * 10);

        data.push({'time': i, "A": a, "B": b})
    }
    return data;
}

function Plot() {

    return (
      <ResponsiveContainer width={500} height={300}>
        <LineChart
          width={500}
          height={300}
          data={randomData()}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time">
            <Label value="Time [mS]" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis label={{ value: 'Voltage [mV]', angle: -90, position: 'insideLeft' }}/>
          <Tooltip />
          <Legend verticalAlign="top" height={0}/>
          <Line type="basis" dataKey="A" stroke="#8884d8" dot={false}/>
          <Line type="basis" dataKey="B" stroke="#228B22" dot={false}/>

        </LineChart>
      </ResponsiveContainer>
    );
}

export default Plot;


