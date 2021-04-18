import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IMechanismProcess, impKeys } from '../../Wrapper';

export function useDynamicForms() {
    const { state, setState } = useContext(AppContext);

    const setKeyChecked = (impKey: impKeys, key: string, checked: boolean) => {
        const gm = [...(state as any)[impKey]] as IMechanismProcess[];
        const vals = gm.find((mech) => mech.key === key);
        vals!.add = checked;
        setState({ ...state, [impKey]: gm });
    };

    const setCurrKeyIdx = (impKey: impKeys, idx: number) => {
        const currAttrKeys = { ...state.currAttrKeySelectedIdx };
        currAttrKeys[impKey] = idx;
        setState({ ...state, currAttrKeySelectedIdx: currAttrKeys });
    };

    const onChangeGlobalMech = (mech: string, attr: string, value: number) => {
        const globalMechs = [...state.globalMechanism];
        const vals = globalMechs.find((m) => m.key === mech);
        const attrs = vals!.attrs.find((a) => a.attr === attr);
        attrs!.value = value;
        setState({ ...state, globalMechanism: globalMechs });
    };

    return { setCurrKeyIdx, setKeyChecked, onChangeGlobalMech };
}
