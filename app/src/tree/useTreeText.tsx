import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { section_short_labels } from '../Wrapper';

export function useTreeText() {
    const { state, setState } = useContext(AppContext);

    const sectionKeyToLabel = (sectionKey: string): string => {
        const keys = sectionKey.split('_');
        const cid = keys[0];
        const tid = keys[1];
        return `${section_short_labels[tid]}[${cid}]`;
    };

    const isSectionSelected = (sectionKey: string): boolean => {
        const selectedLine = state.lines[state.selectedId];
        if (!selectedLine) return false;
        const selectedCid = selectedLine.cid;
        const selectedTid = selectedLine.tid;
        return `${selectedCid}_${selectedTid}` === sectionKey;
    };

    const setSectionChecked = (sectionKey: string) => {
        const selectedSecs = { ...state.selectedSections };
        const isChecked = selectedSecs[sectionKey];
        selectedSecs[sectionKey] = !isChecked;
        setState({ ...state, selectedSections: selectedSecs });
    };

    const isSectionChecked = (sectionKey: string): boolean => {
        return state.selectedSections[sectionKey];
    };

    return { sectionKeyToLabel, isSectionSelected, isSectionChecked, setSectionChecked };
}
