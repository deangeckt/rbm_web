import { useContext } from 'react';
import { AppContext } from '../Contexts/AppContext';
import { IMechanismProcess, impKeys } from '../Wrapper';

export function useDynamicForms() {
    const { state, setState } = useContext(AppContext);

    const setKeyChecked = (impKey: impKeys, key: string, checked: boolean) => {
        const gm = [...(state as any)[impKey]] as IMechanismProcess[];
        const vals = gm.find((mech) => mech.key === key);
        vals!.add = checked;
        setState({ ...state, [impKey]: gm });
    };

    const setKeySelected = (key: string) => {
        setState({ ...state, mechProcKeySelected: key });
    };

    return { setKeySelected, setKeyChecked };
}
