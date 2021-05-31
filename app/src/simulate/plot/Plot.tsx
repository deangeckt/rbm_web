import React, { useContext } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import Carousel from 'react-material-ui-carousel';
import { AppContext } from '../../AppContext';
import { usePlots } from './usePlot';

export interface IPlotProps {
    display: boolean;
}

function Plot({ display }: IPlotProps) {
    const { state } = useContext(AppContext);
    const { getPlotOptions } = usePlots();

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
                                options={getPlotOptions(plot.volt, plot.time, 'Voltage [mV]')}
                            />
                            <HighchartsReact
                                key={`${i}_c`}
                                highcharts={Highcharts}
                                options={getPlotOptions(plot.current, plot.time, 'Current [mA]')}
                            />
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
}

export default Plot;
