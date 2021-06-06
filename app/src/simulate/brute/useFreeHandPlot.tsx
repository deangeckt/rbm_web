import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { y_pixel_to_grid } from './FreeHandCanvas';
import { simpleLine } from './FreeHandPlot';

export function useFreeHandPlot() {
    const { state, setState } = useContext(AppContext);

    const setTime = (time: number) => {
        const brutePlotInput = { ...state.brutePlotInput };
        brutePlotInput.time = time;
        setState({ ...state, brutePlotInput: brutePlotInput });
    };

    const getTime = () => {
        return state.brutePlotInput.time;
    };

    const setPlot = (lines: simpleLine[], maxy: number, miny: number) => {
        const brutePlotInput = { ...state.brutePlotInput };

        const yVec: number[] = [];
        const line = lines[lines.length - 1];
        if (!line) return [];
        line.points.forEach((point, idx) => {
            if (idx % 2 !== 0) yVec.push(y_pixel_to_grid(point, maxy, miny));
        });

        brutePlotInput.plot = yVec;

        setState({ ...state, brutePlotInput: brutePlotInput });
    };

    const clearPlot = () => {
        const brutePlotInput = { ...state.brutePlotInput };
        brutePlotInput.plot = [];
        setState({ ...state, brutePlotInput: brutePlotInput });
    };

    return { setTime, getTime, setPlot, clearPlot };
}
