import { useContext } from 'react';
import { AppContext } from '../Contexts/AppContext';

export function useSimulate() {
    const { state, setState } = useContext(AppContext);

    const updateInput = (id: string, val: number) => {
        const updateInputs = [...state.inputs];
        const currInput = updateInputs.find((ele) => ele.id === id);
        if (!currInput) return;

        currInput.value = val;
        setState({ ...state, inputs: updateInputs });
    };

    const updateStim = (field: string, value: number, idx: number) => {
        const stims = [...state.stims];
        (stims[idx] as any)[field] = value;
        setState({ ...state, stims: stims });
    };

    const addStim = () => {
        const stims = [...state.stims];
        stims.push({
            delay: 0,
            duration: 20,
            amplitude: 20,
            type: 1,
            id: 0,
            section: 0.5,
        });
        setState({ ...state, stims: stims });
    };

    const deleteStim = (idx: number) => {
        const stims = [...state.stims];
        stims.splice(idx, 1);
        setState({ ...state, stims: stims });
    };

    return { addStim, updateInput, updateStim, deleteStim };
}
