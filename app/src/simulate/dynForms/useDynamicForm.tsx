import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IMechanismProcess, impKeys, ISection } from '../../Wrapper';

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
            const globalMech = [...state.globalMechanism];
            const vals = globalMech[state.globalMechanismCurrKeyIdx];
            vals.add = checked;
            setState({ ...state, globalMechanism: globalMech });
        } else {
            const selectedSections = getAllSelectedSections();
            const keyIdx = impKey === 'pointMechanism' ? 'processKeyIdx' : 'mechanismKeyIdx';
            const keyMp = impKey === 'pointMechanism' ? 'mechanism' : 'process';
            console.log('selected:', selectedSections);
            selectedSections.forEach((sec) => {
                const mps = (sec as any)[keyMp] as IMechanismProcess[];
                const idx = (sec as any)[keyIdx] as number;
                mps[idx].add = checked;
            });
            updateSelectedSectionsState(selectedSections);
        }
    };

    const setCurrKeyIdx = (impKey: impKeys, idx: number) => {
        if (impKey === 'globalMechanism') {
            setState({ ...state, globalMechanismCurrKeyIdx: idx });
        } else {
            const selectedSections = getAllSelectedSections();
            const keyIdx = impKey === 'pointMechanism' ? 'processKeyIdx' : 'mechanismKeyIdx';
            selectedSections.forEach((sec) => ((sec as any)[keyIdx] = idx));
            updateSelectedSectionsState(selectedSections);
        }
    };

    const getSectionCurrKeyIdx = (impKey: impKeys): number => {
        const selecedSection = getFirstSelectedSection();
        if (impKey === 'pointMechanism') return selecedSection?.processKeyIdx ?? 0;
        else return selecedSection?.mechanismKeyIdx ?? 0;
    };

    const onChangeGlobalMech = (mech: string, attr: string, value: number) => {
        const globalMechs = [...state.globalMechanism];
        const vals = globalMechs.find((m) => m.key === mech);
        const attrs = vals!.attrs.find((a) => a.attr === attr);
        attrs!.value = value;
        setState({ ...state, globalMechanism: globalMechs });
    };

    // const/ on

    return { setCurrKeyIdx, setKeyChecked, onChangeGlobalMech, getSectionCurrKeyIdx };
}
