import { useContext } from 'react';
import { AppContext } from '../Contexts/AppContext';
import { none_selected, root_id } from '../Wrapper';

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
        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
        let newStimId;
        let newStimType;
        if (!selectedLine || state.selectedId === none_selected) {
            newStimType = root_id;
            newStimId = 0;
        } else {
            newStimType = selectedLine.tid;
            newStimId = selectedLine.internalId;
        }
        stims.push({
            delay: 0,
            duration: 20,
            amplitude: 20,
            type: newStimType,
            id: newStimId,
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
