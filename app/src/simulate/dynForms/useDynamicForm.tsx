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
            selectedSections.forEach((sec) => {
                const mps = (sec as any)[keyMp] as Record<string, IMechanismProcess>;
                const currKey = (sec as any)[keyRef] as string;
                if (!mps[currKey]) mps[currKey] = { attrs: {}, add: false };
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

    const getDynamicFormProps = (
        impKey: impKeys,
    ): { selectedKey: string; selectedAttrs: IAttr; isSelectedKeyChecked: boolean } => {
        let selectedKey: string;
        let isSelectedKeyChecked: boolean;
        if (impKey === 'globalMechanism') {
            selectedKey = state.globalMechanismCurrKey;
            isSelectedKeyChecked = state.globalMechanism[selectedKey].add ?? false;
        } else {
            const selecedSection = getFirstSelectedSection();
            if (!selecedSection) return { selectedKey: '', selectedAttrs: {}, isSelectedKeyChecked: false };
            const keyMp = impKey === 'pointMechanism' ? 'mechanism' : 'process';
            selectedKey = impKey === 'pointMechanism' ? selecedSection.mechanismCurrKey : selecedSection.processCurrKey;
            const vals = (selecedSection as any)[keyMp][selectedKey];
            isSelectedKeyChecked = vals?.add ?? false;
        }
        const selectedAttrs = selectedKey === '' ? {} : ((state as any)[impKey][selectedKey].attrs as IAttr);

        return { selectedKey, selectedAttrs, isSelectedKeyChecked };
    };

    const onChange = (impKey: impKeys, attr: string, value: number) => {
        if (impKey === 'globalMechanism') {
            const globalMechs = { ...state.globalMechanism };
            const vals = globalMechs[state.globalMechanismCurrKey];
            vals.attrs[attr] = value;
            setState({ ...state, globalMechanism: globalMechs });
        } else {
            const selectedSections = getAllSelectedSections();
            const keyRef = impKey === 'pointMechanism' ? 'mechanismCurrKey' : 'processCurrKey';
            const keyMp = impKey === 'pointMechanism' ? 'mechanism' : 'process';
            selectedSections.forEach((sec) => {
                const mps = (sec as any)[keyMp] as Record<string, IMechanismProcess>;
                const currKey = (sec as any)[keyRef] as string;
                mps[currKey].attrs[attr] = value;
            });
            updateSelectedSectionsState(selectedSections);
        }
    };

    return { getDynamicFormProps, setCurrKey, setKeyChecked, onChange };
}
