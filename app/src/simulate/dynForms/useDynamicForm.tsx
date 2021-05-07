import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IAttr, impKeys, mpObj } from '../../Wrapper';
import { useDynamicFormShare } from './useDynnamicFormShare';

export function useDynamicForms() {
    const { state, setState } = useContext(AppContext);
    const { getFirstSelectedSection, getAllSelectedSections, updateSelectedSectionsState } = useDynamicFormShare();

    const setKeyCheckedSectionAux = (mp: mpObj, currKey: string, checked: boolean) => {
        if (currKey === '') return;
        if (!mp[currKey]) mp[currKey] = { attrs: {}, add: false };
        mp[currKey].add = checked;
    };

    const setKeyChecked = (impKey: impKeys, checked: boolean) => {
        if (impKey === 'globalMechanism') {
            const globalMechanism = { ...state.globalMechanism };
            const mech = globalMechanism[state.globalMechanismCurrKey];
            mech.add = checked;
            setState({ ...state, globalMechanism: globalMechanism });
        } else {
            const selectedSections = getAllSelectedSections();
            if (impKey === 'pointMechanism') {
                selectedSections.forEach((sec) => {
                    setKeyCheckedSectionAux(sec.mechanism, sec.mechanismCurrKey, checked);
                });
            } else {
                selectedSections.forEach((sec) => {
                    setKeyCheckedSectionAux(sec.process[sec.processSectionCurrKey], sec.processCurrKey, checked);
                });
            }
            updateSelectedSectionsState(selectedSections);
        }
    };

    const onAttrSectionChangeAux = (mp: mpObj, currKey: string, attr: string, value: number) => {
        if (currKey === '') return;
        mp[currKey].attrs[attr] = value;
    };

    const onAttrChange = (impKey: impKeys, attr: string, value: number) => {
        if (impKey === 'globalMechanism') {
            const globalMechanism = { ...state.globalMechanism };
            const mech = globalMechanism[state.globalMechanismCurrKey];
            mech.attrs[attr] = value;
            setState({ ...state, globalMechanism: globalMechanism });
        } else {
            const selectedSections = getAllSelectedSections();
            if (impKey === 'pointMechanism') {
                selectedSections.forEach((sec) => {
                    onAttrSectionChangeAux(sec.mechanism, sec.mechanismCurrKey, attr, value);
                });
            } else {
                selectedSections.forEach((sec) => {
                    onAttrSectionChangeAux(sec.process[sec.processSectionCurrKey], sec.processCurrKey, attr, value);
                });
            }
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

    const getDynamicFormPropsSectionAux = (sectionMp: mpObj, globalMp: mpObj, currKey: string) => {
        const mp = sectionMp[currKey];
        console.log(globalMp);
        const defaultAttrs = globalMp[currKey].attrs;
        const isSelectedKeyChecked = mp?.add ?? false;

        // set only the changed attrs by user. mp.attrs.len <= defaultAtts.len
        mp &&
            Object.entries(mp.attrs).forEach(([attr, val]) => {
                defaultAttrs[attr] = val;
            });
        return { selectedAttrs: defaultAttrs, isSelectedKeyChecked };
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
            selectedKey = impKey === 'pointMechanism' ? selecedSection.mechanismCurrKey : selecedSection.processCurrKey;
            if (selectedKey === '') return { selectedKey: '', selectedAttrs: {}, isSelectedKeyChecked: false };

            if (impKey === 'pointMechanism') {
                ({ selectedAttrs, isSelectedKeyChecked } = getDynamicFormPropsSectionAux(
                    selecedSection.mechanism,
                    JSON.parse(JSON.stringify(state.pointMechanism)),
                    selectedKey,
                ));
            } else {
                ({ selectedAttrs, isSelectedKeyChecked } = getDynamicFormPropsSectionAux(
                    selecedSection.process[selecedSection.processSectionCurrKey],
                    JSON.parse(JSON.stringify(state.pointProcess)),
                    selectedKey,
                ));
            }
        }

        return { selectedKey, selectedAttrs, isSelectedKeyChecked };
    };

    return {
        getDynamicFormProps,
        setCurrKey,
        setKeyChecked,
        onAttrChange,
    };
}
