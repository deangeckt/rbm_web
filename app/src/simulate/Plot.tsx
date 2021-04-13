import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { IData } from './Simulate';

function oneD2d(data: IData[]) {
    const t = data.find((d) => d.name == 'time');
    if (!t) {
        return [{ plot: [], name: '' }];
    }
    return data
        .filter((d) => {
            return d.name != 'time';
        })
        .map((d) => {
            const r = [];
            for (let i = 0; i < t.plot.length; i++) r.push([t.plot[i], d.plot[i]]);
            return { name: d.name, plot: r };
        });
}

function options(data: IData[]) {
    const series: { data: number[][]; lineWidth?: number; name: string; marker?: { enabled: boolean } }[] = [];
    if (data.length === 0) {
        series.push({ data: [], name: '' });
    } else {
        console.log(data);
        oneD2d(data).forEach((d: { plot: number[][]; name: string }) => {
            series.push({ data: d.plot, lineWidth: 0.75, name: d.name, marker: { enabled: false } });
        });
    }
    return {
        chart: {
            type: 'spline',
            zoomType: 'xy',
        },
        title: {
            text: '',
        },
        tooltip: {
            valueDecimals: 2,
        },
        xAxis: {
            title: { text: 'Time [mS]' },
        },
        yAxis: {
            title: { text: 'Voltage [mV]' },
        },
        series: series,
    };
}

export interface IPlotProps {
    data: IData[];
}

function Plot(props: IPlotProps) {
    return <HighchartsReact highcharts={Highcharts} options={options(props.data)} />;
}

export default Plot;
