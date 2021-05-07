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
            if (!Object.keys(sec.process).includes(value.toString())) {
                sec.process[value] = Object.assign({}, sec.process[sec.processSectionCurrKey]);
                delete sec.process[sec.processSectionCurrKey];
                sec.processSectionCurrKey = value;
            }
        });
        updateSelectedSectionsState(selectedSections);
    };

    const deleteProcess = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            delete sec.process[sec.processSectionCurrKey];
            const sectionsKeys = Object.keys(sec.process);
            sec.processSectionCurrKey = Number(sectionsKeys[sectionsKeys.length - 1]);
        });
        updateSelectedSectionsState(selectedSections);
    };

    const addProcess = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            sec.process[-1] = {};
            sec.processSectionCurrKey = -1;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const disableDeleteProcess = (): boolean => {
        const selectedSections = getFirstSelectedSection();
        if (!selectedSections) return true;
        return Object.keys(selectedSections.process).length === 1;
    };

    return {
        getSectionRecording,
        updateSectionRecording,
        getSectionValue,
        updateSectionValue,
        addProcess,
        deleteProcess,
        disableDeleteProcess,
    };
}
