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

    const deleteSectionSegment = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            delete sec.process[sec.processSectionCurrKey];
            const sectionsKeys = Object.keys(sec.process);
            sec.processSectionCurrKey = Number(sectionsKeys[sectionsKeys.length - 1]);
        });
        updateSelectedSectionsState(selectedSections);
    };

    const deleteProcess = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            const mulObj = sec.process[sec.processSectionCurrKey];
            const procList = mulObj[sec.processCurrKey];
            procList.splice(sec.processCurrKeyCurrIdx[sec.processCurrKey], 1);
            sec.processCurrKeyCurrIdx[sec.processCurrKey] = procList.length - 1;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const addSectionSegment = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            sec.process[-1] = {};
            sec.processSectionCurrKey = -1;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const addProcess = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            if (sec.processCurrKey === '') return;
            const mulObj = sec.process[sec.processSectionCurrKey];
            const procList = mulObj[sec.processCurrKey];
            procList.push({ attrs: {}, add: false });
            sec.processCurrKeyCurrIdx[sec.processCurrKey] = procList.length - 1;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const onlyOneProcess = (): boolean => {
        const sec = getFirstSelectedSection();
        if (!sec) return true;
        if (sec.processCurrKey === '') return true;
        const procList = sec.process[sec.processSectionCurrKey][sec.processCurrKey];
        if (!procList) return true;
        return procList.length <= 1;
    };

    const disableProcessAdd = (): boolean => {
        const sec = getFirstSelectedSection();
        if (!sec) return true;
        return sec.processCurrKey === '';
    };

    const onlyOneSectionSegment = (): boolean => {
        const selectedSection = getFirstSelectedSection();
        if (!selectedSection) return true;
        return Object.keys(selectedSection.process).length === 1;
    };

    const SectionSegmentNavigate = (next: boolean) => {
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

    const processNaviagte = (next: boolean) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            const procList = sec.process[sec.processSectionCurrKey][sec.processCurrKey];
            const currIdx = sec.processCurrKeyCurrIdx[sec.processCurrKey];
            const newIdx = next ? currIdx + 1 : currIdx - 1;
            if (newIdx > procList.length - 1 || newIdx < 0) return;
            sec.processCurrKeyCurrIdx[sec.processCurrKey] = newIdx;
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
        addSectionSegment,
        deleteSectionSegment,
        onlyOneSectionSegment,
        SectionSegmentNavigate,
        onChangeGeneralAttr,
        getSectionGenenralAttr,
        deleteProcess,
        addProcess,
        onlyOneProcess,
        processNaviagte,
        disableProcessAdd,
    };
}
