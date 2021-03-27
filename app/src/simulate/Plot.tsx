import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';


function calculateY(x: number) {
    return Math.sin(x);
}

function calc() {
    var y = [];
    var v = []
    var timeArr = linespace(-5,5,300);
    console.log(timeArr);
    for (var i = 0; i < timeArr.length; i++) {
        y[i] = calculateY(timeArr[i]);
        v[i] = [timeArr[i], y[i]];
    }
    return v;
}

function linespace(start: number, stop: number, cardinality: number) {
    var arr = [];
    var step = (stop - start) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(start + (step * i));
    }
    return arr;
}


const options = {
    chart: {
      type: 'spline',
      zoomType: 'xy'
    },
    title: {
        text: ''
    },
    tooltip: {
        valueDecimals: 2
    },
    xAxis: {
        type: 'time',
        title: {text: "Time [mS]"}
    },
    yAxis: {
        title: {text: "Voltage [mV]"}
    },
    series: [
      {
        data: calc(),
        lineWidth: 0.75,
        name: 'A',
        marker: {
            enabled: false
        }
      }
    ]
  };

function Plot() {

    return (
        <HighchartsReact highcharts={Highcharts} options={options} />
    );
}

export default Plot;


