import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IAttr, IMechanismProcess, impKeys, ISection } from '../../Wrapper';

export function useDynamicForms() {
    const { state, setState } = useContext(AppContext);

    const getFirstSelectedSection = (): ISection | undefined => {
        const selecedSections = Object.entries(state.selectedSections).filter(([, added]) => !!added);
        if (selecedSections.length === 0) return undefined;
        const sectionKey = selecedSections[0][0];
        return state.sectionLines[sectionKey];
    };

    const getAllSelectedSections = (): ISection[] => {
        const selectedSections: ISection[] = [];
        const selectedKeys = Object.entries(state.selectedSections)
            .filter(([, added]) => added)
            .map(([key]) => key);
        selectedKeys.forEach((key) => selectedSections.push(state.sectionLines[key]));
        return selectedSections;
    };

    const updateSelectedSectionsState = (sections: ISection[]) => {
        const sectionLines = { ...state.sectionLines };
        sections.forEach((sec) => (sectionLines[sec.key] = sec));
        setState({ ...state, sectionLines: sectionLines });
    };

    const setKeyChecked = (impKey: impKeys, checked: boolean) => {
        if (impKey === 'globalMechanism') {
            const globalMech = { ...state.globalMechanism };
            const vals = globalMech[state.globalMechanismCurrKey];
            vals.add = checked;
            setState({ ...state, globalMechanism: globalMech });
        } else {
            const selectedSections = getAllSelectedSections();
            const keyRef = impKey === 'pointMechanism' ? 'mechanismCurrKey' : 'processCurrKey';
            const keyMp = impKey === 'pointMechanism' ? 'mechanism' : 'process';
            console.log('selected:', selectedSections); // BUG HERE - update all sections
            selectedSections.forEach((sec) => {
                const mps = (sec as any)[keyMp] as Record<string, IMechanismProcess>;
                const currKey = (sec as any)[keyRef] as string;
                if (!mps[currKey]) mps[currKey] = { attrs: [], add: false };
                mps[currKey].add = checked;
            });
            updateSelectedSectionsState(selectedSections);
        }
    };

    const setCurrKey = (impKey: impKeys, key: string) => {
        if (impKey === 'globalMechanism') {
            setState({ ...state, globalMechanismCurrKey: key });
        } else {
            const selectedSections = getAllSelectedSections();
            const keyRef = impKey === 'pointMechanism' ? 'mechanismCurrKey' : 'processCurrKey';
            selectedSections.forEach((sec) => ((sec as any)[keyRef] = key));
            updateSelectedSectionsState(selectedSections);
        }
    };

    // const getSectionCurrKey = (impKey: impKeys): string => {
    //     const selecedSection = getFirstSelectedSection();
    //     if (impKey === 'pointMechanism') return selecedSection?.mechanismCurrKey ?? '';
    //     else return selecedSection?.processCurrKey ?? '';
    // };

    const getDynamicFormProps = (
        impKey: impKeys,
    ): { selectedKey: string; selectedAttrs: IAttr[]; isSelectedKeyChecked: boolean } => {
        let selectedKey: string;
        let selectedAttrs: IAttr[];
        let isSelectedKeyChecked: boolean;
        if (impKey === 'globalMechanism') {
            selectedKey = state.globalMechanismCurrKey;
            const vals = state.globalMechanism[selectedKey];
            selectedAttrs = vals?.attrs ?? [];
            isSelectedKeyChecked = vals?.add ?? false;
        } else {
            const selecedSection = getFirstSelectedSection();
            if (!selecedSection) return { selectedKey: '', selectedAttrs: [], isSelectedKeyChecked: false };
            const keyMp = impKey === 'pointMechanism' ? 'mechanism' : 'process';
            selectedKey = impKey === 'pointMechanism' ? selecedSection.mechanismCurrKey : selecedSection.processCurrKey;
            const vals = (selecedSection as any)[keyMp][selectedKey];
            selectedAttrs = vals?.attrs ?? [];
            isSelectedKeyChecked = vals?.add ?? false;
        }
        return { selectedKey, selectedAttrs, isSelectedKeyChecked };
    };

    const onChangeGlobalMech = (attr: string, value: number) => {
        const globalMechs = { ...state.globalMechanism };
        const vals = globalMechs[state.globalMechanismCurrKey];
        const attrs = vals.attrs.find((a) => a.attr === attr);
        attrs!.value = value;
        setState({ ...state, globalMechanism: globalMechs });
    };

    // const/ on

    return { getDynamicFormProps, setCurrKey, setKeyChecked, onChangeGlobalMech };
}
