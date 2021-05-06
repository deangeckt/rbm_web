import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { default_section_value } from '../../Wrapper';
import { useDynamicFormShare } from '../dynForms/useDynnamicFormShare';

export function useSectionForm() {
    const { state, setState } = useContext(AppContext);
    const { getFirstSelectedSection, getAllSelectedSections, updateSelectedSectionsState } = useDynamicFormShare();

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
        return selectedSections.processSectionCurrKey;
    };

    const updateSectionValue = (value: number) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            sec.processSectionCurrKey = value;
            // TODO: deep copy obj
        });
        updateSelectedSectionsState(selectedSections);
    };

    const addProcess = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            sec.process[default_section_value] = {};
        });
    };

    return {
        getSectionRecording,
        updateSectionRecording,
        getSectionValue,
        updateSectionValue,
        addProcess,
    };
}
