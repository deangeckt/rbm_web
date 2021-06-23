import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IBruteAttr, impKeys, SectionBruteScheme, singleBruteAttrObj } from '../../Wrapper';
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
        if (!attrs[attrKey]) return 0;
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
            if (!state.bruteSections[sec.id]) return 0;
            attrs = getMechAttrObj(state.bruteSections[sec.id].mechanism, currKey);
        }
        return getMechAttrAux(attrs, attrKey, attrType);
    };

    const setMechAttrAux = (attrs: IBruteAttr | null, attrKey: string, attrType: attrType, value: number) => {
        if (!attrs) return;
        if (!attrs[attrKey]) attrs[attrKey] = { min: 0, max: 0, amount: 0 };
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
            const bruteSections = { ...state.bruteSections };

            selectedSections.forEach((sec) => {
                const currKey = sec.mechanismCurrKey;
                if (currKey === '') return;
                const attrs = getMechAttrObj(bruteSections[sec.id].mechanism, currKey);
                setMechAttrAux(attrs, attrKey, attrType, value);
            });
            setState({ ...state, bruteSections: bruteSections });
        }
    };

    const getSectionGeneralAttr = (attrKey: string, attrType: attrType): number => {
        const sec = getFirstSelectedSection();
        if (!sec) return 0;
        if (!state.bruteSections[sec.id]) return 0;
        if (!state.bruteSections[sec.id].general) return 0;
        if (!state.bruteSections[sec.id]?.general[attrKey]) return 0;
        return (state.bruteSections[sec.id]?.general[attrKey] as any)[attrType];
    };

    const setSectionGeneralAttr = (attrKey: string, attrType: attrType, value: number) => {
        const bruteSections = { ...state.bruteSections };
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            if (!bruteSections[sec.id])
                bruteSections[sec.id] = {
                    id: sec.id,
                    mechanism: {},
                    general: {},
                    generalChanged: false,
                };
            if (!bruteSections[sec.id].general) bruteSections[sec.id].general = {};

            if (!bruteSections[sec.id].general[attrKey])
                bruteSections[sec.id].general[attrKey] = { min: 0, max: 0, amount: 0 };

            (bruteSections[sec.id].general[attrKey] as any)[attrType] = value;
            bruteSections[sec.id].generalChanged = true;
        });
        setState({ ...state, bruteSections: bruteSections });
    };

    const filterBruteMech = (mechObj: singleBruteAttrObj): { filtered: singleBruteAttrObj; amount: number } => {
        const filtered: singleBruteAttrObj = {};
        let amount = 1;
        Object.entries(mechObj).forEach(([key, mech]) => {
            if (mech.add) {
                filtered[key] = { attrs: {} };
                Object.entries(mech.attrs).forEach(([attrKey, attr]) => {
                    if (attr.amount > 0) {
                        filtered[key].attrs[attrKey] = { ...attr };
                        amount *= attr.amount;
                    }
                });
            }
        });
        return { filtered, amount };
    };

    const getBruteChangedForm = (): {
        bruteGlobalMechanism: singleBruteAttrObj;
        bruteSections: Record<string, SectionBruteScheme>;
        amount: number;
    } => {
        let totalAmount = 1;
        const { filtered, amount } = filterBruteMech(state.bruteGlobalMechanism);
        const filterGlobalMech = filtered;
        totalAmount *= amount;

        const filterSections: Record<string, SectionBruteScheme> = {};
        const sectionEnts = Object.values(state.sections);
        for (let i = 0; i < sectionEnts.length; i++) {
            const sec = sectionEnts[i];
            const bruteSec = state.bruteSections[sec.id];
            const { filtered, amount } = filterBruteMech(bruteSec?.mechanism ?? {});
            const filterMechList = filtered;
            totalAmount *= amount;

            const filterSectionGeneral: IBruteAttr = {};
            if (bruteSec?.generalChanged) {
                Object.entries(bruteSec.general).forEach(([key, param]) => {
                    if (param.amount > 0) {
                        totalAmount *= param.amount;
                        filterSectionGeneral[key] = param;
                    }
                });
            }

            if (Object.keys(filterSectionGeneral).length || Object.keys(filterMechList).length) {
                filterSections[sec.id] = {
                    id: bruteSec.id,
                    general: filterSectionGeneral,
                    mechanism: filterMechList,
                };
            }
        }

        return { bruteGlobalMechanism: filterGlobalMech, bruteSections: filterSections, amount: totalAmount };
    };

    const isRunValid = (): boolean => {
        const brutePlotInput = { ...state.brutePlotInput };
        return brutePlotInput.plot.length > 0 && brutePlotInput.section !== undefined;
    };

    return { isRunValid, getMechAttr, setMechAttr, getSectionGeneralAttr, setSectionGeneralAttr, getBruteChangedForm };
}
