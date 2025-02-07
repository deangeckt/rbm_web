import { default_section_value, IMechanismProcess } from '../../Wrapper';
import { useDynamicFormShare } from '../dynForms/useDynnamicFormShare';

export function useSectionForm() {
    const { getFirstSelectedSection, getAllSelectedSections, updateSelectedSectionsState } = useDynamicFormShare();

    const getSectionRecording = () => {
        const sec = getFirstSelectedSection();
        if (!sec) return [];
        return sec.records[sec.segmentCurrKey];
    };

    const updateSectionRecording = (val: number, add: boolean) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            const records = sec.records[sec.segmentCurrKey];
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            add && records.push(val);
            if (!add) {
                const idx = records.indexOf(val);
                records.splice(idx, 1);
            }
        });
        updateSelectedSectionsState(selectedSections);
    };

    const getSectionSegment = () => {
        const selectedSection = getFirstSelectedSection();
        if (!selectedSection) return default_section_value;
        return selectedSection.segmentCurrKey;
    };

    const updateSectionSegment = (value: number) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            if (!Object.keys(sec.process).includes(value.toString())) {
                sec.process[value] = Object.assign({}, sec.process[sec.segmentCurrKey]);
                sec.records[value] = Object.assign([], sec.records[sec.segmentCurrKey]);
                delete sec.process[sec.segmentCurrKey];
                delete sec.records[sec.segmentCurrKey];
                sec.segmentCurrKey = value;
            }
        });
        updateSelectedSectionsState(selectedSections);
    };

    const deleteSectionSegment = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            delete sec.process[sec.segmentCurrKey];
            delete sec.records[sec.segmentCurrKey];
            const sectionsKeys = Object.keys(sec.process);
            sec.segmentCurrKey = Number(sectionsKeys[sectionsKeys.length - 1]);
        });
        updateSelectedSectionsState(selectedSections);
    };

    const addSectionSegment = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            sec.process[-1] = {};
            sec.records[-1] = [];
            sec.segmentCurrKey = -1;
        });
        updateSelectedSectionsState(selectedSections);
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
            const currIdx = keys.findIndex((k) => k === sec.segmentCurrKey.toString());
            const newIdx = next ? currIdx + 1 : currIdx - 1;
            if (newIdx > keys.length - 1 || newIdx < 0) return;
            const newKey = keys[newIdx];
            sec.segmentCurrKey = Number(newKey);
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

    const processNaviagte = (next: boolean) => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            const procList = getProcList();
            if (!procList) return;
            const currIdx = sec.processCurrKeyCurrIdx[sec.processCurrKey];
            const newIdx = next ? currIdx + 1 : currIdx - 1;
            if (newIdx > procList.length - 1 || newIdx < 0) return;
            sec.processCurrKeyCurrIdx[sec.processCurrKey] = newIdx;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const deleteProcess = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            const procList = getProcList();
            if (!procList) return;
            procList.splice(sec.processCurrKeyCurrIdx[sec.processCurrKey], 1);
            sec.processCurrKeyCurrIdx[sec.processCurrKey] = procList.length - 1;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const addProcess = () => {
        const selectedSections = getAllSelectedSections();
        selectedSections.forEach((sec) => {
            const procList = getProcList();
            if (!procList) return;
            procList.push({ attrs: {}, add: false });
            sec.processCurrKeyCurrIdx[sec.processCurrKey] = procList.length - 1;
        });
        updateSelectedSectionsState(selectedSections);
    };

    const getProcList = (): IMechanismProcess[] | undefined => {
        const sec = getFirstSelectedSection();
        if (!sec) return undefined;
        if (sec.processCurrKey === '') return undefined;
        return sec.process[sec.segmentCurrKey][sec.processCurrKey];
    };

    const onlyOneProcess = (): boolean => {
        const procList = getProcList();
        if (!procList) return true;
        return procList.length <= 1;
    };

    const disableProcessAdd = (): boolean => {
        return !getProcList();
    };

    return {
        getSectionRecording,
        updateSectionRecording,
        getSectionSegment,
        updateSectionSegment,
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
