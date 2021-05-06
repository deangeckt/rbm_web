import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IPlotData } from '../../Wrapper';

export function usePlot() {
    const { state, setState } = useContext(AppContext);

    const getCurrPlot = (): IPlotData[] => {
        const len = state.plots.length;
        if (len === 0) return [];
        return state.plots[len - 1];
    };

    const pushPlot = (plot: IPlotData[]): void => {
        const plots = [...state.plots];
        plots.push(plot);
        setState({ ...state, plots: plots });
    };

    return { pushPlot, getCurrPlot };
}
