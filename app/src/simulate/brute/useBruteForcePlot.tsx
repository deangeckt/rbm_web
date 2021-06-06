import { useContext } from 'react';
import { AppContext } from '../../AppContext';

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
    return { setSegment, getSegment, setSection, getSection };
}
