import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IPlotData } from '../../Wrapper';

export function usePlot() {
    const { state, setState } = useContext(AppContext);

    const pushPlot = (plot: IPlotData[]): void => {
        const plots = [...state.plots];
        plots.push(plot);
        setState({ ...state, plots: plots });
    };

    return { pushPlot };
}
