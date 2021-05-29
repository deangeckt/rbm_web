import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IBruteAttr, impKeys, singleBruteAttrObj } from '../../Wrapper';
import { useDynamicFormShare } from '../dynForms/useDynnamicFormShare';

export type attrType = 'min' | 'max' | 'amount';

export function useBruteForce() {
    const { state, setState } = useContext(AppContext);
    const { getFirstSelectedSection, getAllSelectedSections } = useDynamicFormShare();

    const getMechAttrObj = (attrObj: singleBruteAttrObj, currKey: string) => {
        if (!attrObj) return null;
        if (!attrObj[currKey]) return null;
        const attrs = attrObj[currKey].attrs;
        return attrs;
    };

    const getMechAttrAux = (attrs: IBruteAttr | null, attrKey: string, attrType: attrType): number => {
        if (!attrs) return 0;
        if (attrKey === '') return 0;
        if (!attrs[attrKey]) attrs[attrKey] = { min: 0, max: 0, amount: 0 };
        return (attrs[attrKey] as any)[attrType];
    };

    const getMechAttr = (impKey: impKeys, attrKey: string, attrType: attrType): number => {
        let attrs;
        if (impKey === 'globalMechanism') {
            const currKey = state.globalMechanismCurrKey;
            attrs = getMechAttrObj(state.bruteGlobalMechanism, currKey);
        } else {
            const sec = getFirstSelectedSection();
            if (!sec) return 0;
            const currKey = sec.mechanismCurrKey;
            if (currKey === '') return 0;
            if (!state.bruteSctions[sec.id]) return 0;
            attrs = getMechAttrObj(state.bruteSctions[sec.id].mechanism, currKey);
        }
        return getMechAttrAux(attrs, attrKey, attrType);
    };

    const setMechAttrAux = (attrs: IBruteAttr | null, attrKey: string, attrType: attrType, value: number) => {
        if (!attrs) return;
        if (!attrs[attrKey]) return;
        (attrs[attrKey] as any)[attrType] = value;
    };

    const setMechAttr = (impKey: impKeys, attrKey: string, attrType: attrType, value: number) => {
        if (impKey === 'globalMechanism') {
            const currKey = state.globalMechanismCurrKey;
            const globalMechanism = { ...state.bruteGlobalMechanism };
            const attrs = getMechAttrObj(globalMechanism, currKey);
            setMechAttrAux(attrs, attrKey, attrType, value);
            setState({ ...state, bruteGlobalMechanism: globalMechanism });
        } else {
            const selectedSections = getAllSelectedSections();
            const bruteSections = { ...state.bruteSctions };

            selectedSections.forEach((sec) => {
                const currKey = sec.mechanismCurrKey;
                console.log(currKey);
                if (currKey === '') return;
                const attrs = getMechAttrObj(bruteSections[sec.id].mechanism, currKey);
                setMechAttrAux(attrs, attrKey, attrType, value);
            });
            setState({ ...state, bruteSctions: bruteSections });
        }
    };

    return { getMechAttr, setMechAttr };
}
