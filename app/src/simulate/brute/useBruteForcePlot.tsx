import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { y_pixel_to_grid } from './FreeHandCanvas';
import { simpleLine } from './FreeHandPlot';

export function useBruteForcePlot() {
    const { state, setState } = useContext(AppContext);
    const setSegment = (segment: number) => {
        const brutePlotInput = { ...state.brutePlotInput };
        brutePlotInput.segment = segment;
        setState({ ...state, brutePlotInput: brutePlotInput });
    };
    const getSegment = () => {
        return state.brutePlotInput.segment;
    };
    const setSection = (section?: string) => {
        const brutePlotInput = { ...state.brutePlotInput };
        brutePlotInput.section = section;
        setState({ ...state, brutePlotInput: brutePlotInput });
    };
    const getSection = () => {
        return state.brutePlotInput.section;
    };

    const setTime = (time: number) => {
        const brutePlotInput = { ...state.brutePlotInput };
        brutePlotInput.time = time;
        setState({ ...state, brutePlotInput: brutePlotInput });
    };

    const getTime = () => {
        return state.brutePlotInput.time;
    };

    const setDrawPlot = (lines: simpleLine[], maxy: number, miny: number) => {
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

    const setPlot = (plot: number[]) => {
        const brutePlotInput = { ...state.brutePlotInput };
        brutePlotInput.plot = plot;
        setState({ ...state, brutePlotInput: brutePlotInput });
    };

    const clearPlot = () => {
        const brutePlotInput = { ...state.brutePlotInput };
        brutePlotInput.plot = [];
        setState({ ...state, brutePlotInput: brutePlotInput });
    };

    return { setSegment, getSegment, setSection, getSection, setTime, getTime, setDrawPlot, clearPlot, setPlot };
}
