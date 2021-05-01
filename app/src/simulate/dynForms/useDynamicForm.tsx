import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { default_section_value, IAttr, IMechanismProcess, impKeys, ISection } from '../../Wrapper';

export function useDynamicForms() {
    const { state, setState } = useContext(AppContext);

    const getFirstSelectedSection = (): ISection | undefined => {
        const selecedSections = Object.entries(state.checkedSections).filter(([, added]) => !!added);
        if (selecedSections.length === 0) return undefined;
        const sectionKey = selecedSections[0][0];
        return state.sections[sectionKey];
    };

    const getAllSelectedSections = (): ISection[] => {
        const selectedSections: ISection[] = [];
        const selectedKeys = Object.entries(state.checkedSections)
            .filter(([, added]) => added)
            .map(([key]) => key);
        selectedKeys.forEach((key) => selectedSections.push(state.sections[key]));
        return selectedSections;
    };

    const updateSelectedSectionsState = (selectedSections: ISection[]) => {
        const sections = { ...state.sections };
        selectedSections.forEach((sec) => (sections[sec.id] = sec));
        setState({ ...state, sections: sections });
    };

    const setKeyChecked = (impKey: impKeys, checked: boolean) => {
        if (impKey === 'globalMechanism') {
            const globalMechanism = { ...state.globalMechanism };
            const mech = globalMechanism[state.globalMechanismCurrKey];
            mech.add = checked;
            setState({ ...state, globalMechanism: globalMechanism });
        } else {
            const selectedSections = getAllSelectedSections();
            const keyRef = impKey === 'pointMechanism' ? 'mechanismCurrKey' : 'processCurrKey';
            const keyMp = impKey === 'pointMechanism' ? 'mechanism' : 'process';
            selectedSections.forEach((sec) => {
                const mps = (sec as any)[keyMp] as Record<string, IMechanismProcess>;
                const currKey = (sec as any)[keyRef] as string;
                if (currKey === '') return;
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
        let selectedAttrs: IAttr;
        if (impKey === 'globalMechanism') {
            selectedKey = state.globalMechanismCurrKey;
            isSelectedKeyChecked = state.globalMechanism[selectedKey].add ?? false;
            selectedAttrs = state.globalMechanism[selectedKey].attrs;
        } else {
            const selecedSection = getFirstSelectedSection();
            if (!selecedSection) return { selectedKey: '', selectedAttrs: {}, isSelectedKeyChecked: false };
            const keyMp = impKey === 'pointMechanism' ? 'mechanism' : 'process';
            selectedKey = impKey === 'pointMechanism' ? selecedSection.mechanismCurrKey : selecedSection.processCurrKey;
            if (selectedKey === '') {
                selectedAttrs = {};
                isSelectedKeyChecked = false;
            } else {
                const mp = (selecedSection as any)[keyMp][selectedKey] as IMechanismProcess;
                isSelectedKeyChecked = mp?.add ?? false;
                const defaultAttrs = { ...((state as any)[impKey][selectedKey].attrs as IAttr) };

                // set only the changed attrs by user. mp.attrs.len <= defaultAtts.len
                mp &&
                    Object.entries(mp.attrs).forEach(([attr, val]) => {
                        defaultAttrs[attr] = val;
                    });
                selectedAttrs = defaultAttrs;
            }
        }

        return { selectedKey, selectedAttrs, isSelectedKeyChecked };
    };

    const onChange = (impKey: impKeys, attr: string, value: number) => {
        if (impKey === 'globalMechanism') {
            const globalMechanism = { ...state.globalMechanism };
            const mech = globalMechanism[state.globalMechanismCurrKey];
            mech.attrs[attr] = value;
            setState({ ...state, globalMechanism: globalMechanism });
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

    const getSectionRecording = () => {
        const selectedSections = getFirstSelectedSection();
        if (!selectedSections) return 0;
        return selectedSections.recording_type;
    };

    const updateSectionRecording = (value: number) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            sec.recording_type = value;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const getSectionValue = () => {
        const selectedSections = getFirstSelectedSection();
        if (!selectedSections) return default_section_value;
        return selectedSections.section;
    };

    const updateSectionValue = (value: number) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            sec.section = value;
        });
        updateSelectedSectionsState(selectedSections);
    };

    return {
        getDynamicFormProps,
        setCurrKey,
        setKeyChecked,
        onChange,
        getSectionRecording,
        updateSectionRecording,
        getSectionValue,
        updateSectionValue,
    };
}
