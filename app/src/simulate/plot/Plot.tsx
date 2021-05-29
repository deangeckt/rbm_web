import React, { useContext } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { section_recording, section_short_labels } from '../../Wrapper';
import Carousel from 'react-material-ui-carousel';
import { AppContext } from '../../AppContext';

const parsePlotName = (recordKey: string) => {
    if (recordKey === 'time') return 'time';
    const keys = recordKey.split('_');
    const record_ = keys[0];
    const tid_ = keys[1];
    const id_ = keys[2];
    const section_ = keys[3];
    let res = `${section_short_labels[Number(tid_)]}[${id_}](${section_})`;
    if (record_ !== '0') {
        // not volt
        res = res.concat('_', section_recording[Number(record_)]);
    }
    return res;
};

const oneD2d = (time: number[], name: string, data: number[]) => {
    const r = [];
    for (let i = 0; i < time.length; i++) r.push([time[i], data[i]]);
    return { name: parsePlotName(name), data: r };
};

const options = (data: Record<string, number[]>, time: number[], title: string) => {
    const series: { data: number[][]; lineWidth?: number; name: string; marker?: { enabled: boolean } }[] = [];
    if (time.length === 0) {
        series.push({ data: [], name: '' });
    } else {
        Object.entries(data).forEach(([name, plot]) => {
            const format = oneD2d(time, name, plot);
            series.push({ data: format.data, lineWidth: 1.5, name: format.name, marker: { enabled: false } });
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
            title: { text: title },
        },
        series: series,
    };
};

export interface IPlotProps {
    display: boolean;
}

function Plot({ display }: IPlotProps) {
    const { state } = useContext(AppContext);

    return (
        <div style={{ height: '100%', display: display ? 'flex' : 'none', flexDirection: 'column' }}>
            <Carousel
                navButtonsAlwaysInvisible={true}
                autoPlay={false}
                stopAutoPlayOnHover={false}
                index={state.plots.length - 1}
            >
                {state.plots.map((plot, i) => {
                    return (
                        <div key={i} id={'cccc'}>
                            <HighchartsReact
                                key={`${i}_v`}
                                highcharts={Highcharts}
                                options={options(plot.volt, plot.time, 'Voltage [mV]')}
                            />
                            <HighchartsReact
                                key={`${i}_c`}
                                highcharts={Highcharts}
                                options={options(plot.current, plot.time, 'Current [mA]')}
                            />
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
}

export default Plot;
