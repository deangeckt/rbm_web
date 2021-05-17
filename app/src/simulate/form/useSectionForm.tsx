import { default_section_value } from '../../Wrapper';
import { useDynamicFormShare } from '../dynForms/useDynnamicFormShare';

export function useSectionForm() {
    const { getFirstSelectedSection, getAllSelectedSections, updateSelectedSectionsState } = useDynamicFormShare();

    const getSectionRecording = () => {
        const selectedSection = getFirstSelectedSection();
        if (!selectedSection) return 0;
        return selectedSection.recording_type;
    };

    const updateSectionRecording = (value: number) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            sec.recording_type = value;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const getSectionValue = () => {
        const selectedSection = getFirstSelectedSection();
        if (!selectedSection) return default_section_value;
        return selectedSection.processSectionCurrKey;
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

    const onlyOneProcess = (): boolean => {
        const selectedSection = getFirstSelectedSection();
        if (!selectedSection) return true;
        return Object.keys(selectedSection.process).length === 1;
    };

    const processNavigate = (next: boolean) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            const keys = Object.keys(sec.process);
            const currIdx = keys.findIndex((k) => k === sec.processSectionCurrKey.toString());
            const newIdx = next ? currIdx + 1 : currIdx - 1;
            if (newIdx > keys.length - 1 || newIdx < 0) return;
            const newKey = keys[newIdx];
            sec.processSectionCurrKey = Number(newKey);
        });
        updateSelectedSectionsState(selectedSections);
    };

    const onChangeGeneralAttr = (attr: string, value: number) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            sec.general[attr] = value;
            sec.generalChanged = true;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const getSectionGenenralAttr = () => {
        const selectedSection = getFirstSelectedSection();
        if (!selectedSection) return {};
        return selectedSection.general;
    };

    return {
        getSectionRecording,
        updateSectionRecording,
        getSectionValue,
        updateSectionValue,
        addProcess,
        deleteProcess,
        onlyOneProcess,
        processNavigate,
        onChangeGeneralAttr,
        getSectionGenenralAttr,
    };
}
