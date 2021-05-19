import { useContext } from 'react';
import { parseJsonParams } from '../api/api';
import { AppContext } from '../AppContext';
import {
    default_section_value,
    init_global_curr_key,
    ISection,
    singleAttrObj,
    mulAttrObj,
    SectionScheme,
} from '../Wrapper';

export function useSimulate() {
    const { state, setState } = useContext(AppContext);

    const addNewSection = (key: string, pid: string, swc_id: string, tid: number, radius: number): ISection => {
        return {
            id: key,
            recording_type: 0,
            mechanism: {},
            process: {
                0.5: {},
            },
            mechanismCurrKey: '',
            processCurrKey: '',
            processSectionCurrKey: default_section_value,
            processCurrKeyCurrIdx: {},
            general: {},
            generalChanged: false,
            line: {
                id: swc_id,
                pid: pid,
                points: [],
                children: [],
                tid: tid,
                radius: radius,
            },
        };
    };

    const filterMech = (mps: singleAttrObj) => {
        const filterMp: singleAttrObj = {};

        const addedKeys = Object.entries(mps)
            .filter(([, mp]) => mp.add)
            .map(([key]) => key);
        addedKeys.forEach((id) => {
            filterMp[id] = { ...mps[id] };
        });

        return filterMp;
    };

    const filterProc = (mps: mulAttrObj) => {
        const filterMp: mulAttrObj = {};

        const addedKeys = Object.entries(mps)
            .filter(([, mp]) => mp[0].add)
            .map(([key]) => key);
        addedKeys.forEach((id) => {
            filterMp[id] = [...mps[id]];
        });

        return filterMp;
    };

    const getChangedForm = (): {
        globalMechanism: singleAttrObj;
        sections: Record<string, SectionScheme>;
    } => {
        const filterGlobalMech: singleAttrObj = filterMech(state.globalMechanism);
        const filterSections: Record<string, SectionScheme> = {};

        const sectionEnts = Object.values(state.sections);
        for (let i = 0; i < sectionEnts.length; i++) {
            const sec = sectionEnts[i];

            const filterMechList = filterMech(state.sections[sec.id].mechanism);
            const filterProcList: Record<number, mulAttrObj> = {};
            let anyProcess = false;
            Object.entries(state.sections[sec.id].process).forEach(([sectionKey, proc]) => {
                filterProcList[Number(sectionKey)] = filterProc(proc);
                if (Object.keys(proc).length) anyProcess = true;
            });

            if (sec.generalChanged || anyProcess || Object.keys(filterMech).length || sec.recording_type !== 0) {
                const currSection = state.sections[sec.id];
                filterSections[sec.id] = {
                    id: currSection.id,
                    general: { ...currSection.general },
                    recording_type: currSection.recording_type,
                    process: filterProcList,
                    mechanism: filterMechList,
                };
            }
        }

        return { globalMechanism: filterGlobalMech, sections: filterSections };
    };

    const importJsonParams = async (e: any) => {
        if (e?.target?.files?.length === 0) return;
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e?.target?.result;
            if (text) {
                const { sections, globalMechanism } = parseJsonParams(text as string);

                const currGlobal = { ...state.globalMechanism };
                Object.entries(globalMechanism).forEach(([key, val]) => {
                    currGlobal[key] = val;
                });

                const currSections = { ...state.sections };
                Object.entries(sections).forEach(([key, val]) => {
                    currSections[key].general = val.general;
                    currSections[key].recording_type = val.recording_type;
                    currSections[key].mechanism = val.mechanism;
                    currSections[key].process = val.process;
                    currSections[key].processSectionCurrKey = Number(Object.keys(val.process)[0]);
                });

                setState({
                    ...state,
                    globalMechanism: currGlobal,
                    globalMechanismCurrKey: init_global_curr_key,
                    sections: currSections,
                });
            }
        };
        reader.readAsText(e?.target?.files[0]);
    };

    return { getChangedForm, addNewSection, importJsonParams };
}
