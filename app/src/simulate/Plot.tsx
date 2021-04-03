import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { IData } from './Simulate';


function options(data: IData[]) {
    var series: { data: number[][]; lineWidth: number; name: string; marker: { enabled: boolean; }; }[] = []
    data.forEach(d => {
        series.push({data: d.plot, lineWidth: 0.75, name: d.name, marker: {enabled: false}})
    });
    return {
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
            title: {text: "Time [mS]"}
        },
        yAxis: {
            title: {text: "Voltage [mV]"}
        },
        series: series
    };
}

export interface IPlotProps {
    data: IData[];
}

function Plot(props: IPlotProps) {

    return (
        <HighchartsReact highcharts={Highcharts} options={options(props.data)} />
    );
}

export default Plot;
