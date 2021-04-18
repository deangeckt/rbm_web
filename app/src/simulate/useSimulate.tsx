import { useContext } from 'react';
import { AppContext } from '../AppContext';

export function useSimulate() {
    const { state, setState } = useContext(AppContext);

    const updateStaticGloablnput = (id: string, val: number) => {
        const updateInputs = [...state.inputs];
        const currInput = updateInputs.find((ele) => ele.id === id);
        if (!currInput) return;

        currInput.value = val;
        setState({ ...state, inputs: updateInputs });
    };

    return {
        updateStaticGloablnput,
    };
}
