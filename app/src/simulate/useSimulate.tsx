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
            mechanism: {},
            process: {
                0.5: {},
            },
            records: {
                0.5: [],
            },
            mechanismCurrKey: '',
            processCurrKey: '',
            segmentCurrKey: default_section_value,
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

    const filterMech = (mechObj: singleAttrObj) => {
        const filtered: singleAttrObj = {};
        const addedKeys = Object.entries(mechObj)
            .filter(([, mech]) => mech.add)
            .map(([key]) => key);
        addedKeys.forEach((id) => {
            filtered[id] = { ...mechObj[id] };
        });
        return filtered;
    };

    const filterProc = (procObj: mulAttrObj) => {
        const filtered: mulAttrObj = {};
        Object.entries(procObj).forEach(([key, procList]) => {
            filtered[key] = [];
            procList.forEach((proc) => {
                proc.add && filtered[key].push(proc);
            });
            filtered[key].length === 0 && delete filtered[key];
        });
        return filtered;
    };

    const getChangedForm = (
        ignoreSectionsProcess = false,
        ignoreSectionsRecords = false,
    ): {
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
                const filtered = filterProc(proc);
                if (Object.keys(filtered).length) {
                    anyProcess = true;
                    filterProcList[Number(sectionKey)] = filtered;
                }
            });

            const filterRecords: Record<number, number[]> = {};
            Object.entries(state.sections[sec.id].records).forEach(([sectionKey, recordList]) => {
                recordList.length > 0 && (filterRecords[Number(sectionKey)] = [...recordList]);
            });

            if (
                sec.generalChanged ||
                anyProcess ||
                Object.keys(filterMechList).length ||
                Object.keys(filterRecords).length
            ) {
                const currSection = state.sections[sec.id];
                filterSections[sec.id] = {
                    id: currSection.id,
                    general: { ...currSection.general },
                    process: ignoreSectionsProcess ? {} : filterProcList,
                    mechanism: filterMechList,
                    records: ignoreSectionsRecords ? {} : filterRecords,
                };
            }
        }

        return { globalMechanism: filterGlobalMech, sections: filterSections };
    };

    const importJsonParams = async (e: any, onErr: Function) => {
        if (e?.target?.files?.length === 0) return;
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e?.target?.result;
            if (text) {
                try {
                    const { sections, globalMechanism } = parseJsonParams(text as string);

                    const currGlobal = { ...state.globalMechanism };
                    Object.entries(globalMechanism).forEach(([key, val]) => {
                        currGlobal[key] = val;
                    });

                    const currSections = { ...state.sections };
                    Object.entries(sections).forEach(([key, val]) => {
                        if (!currSections[key]) return;
                        currSections[key].general = val.general;
                        currSections[key].mechanism = val.mechanism;
                        currSections[key].mechanismCurrKey = '';

                        currSections[key].process = val.process;
                        const proc = Object.values(val.process);
                        if (proc.length) {
                            const attrKeys = Object.keys(proc[0]);
                            if (attrKeys.length > 0) {
                                const procCurrKey = attrKeys[0];
                                currSections[key].processCurrKeyCurrIdx[procCurrKey] = 0;
                                currSections[key].processCurrKey = procCurrKey;
                            }
                            currSections[key].segmentCurrKey = Number(Object.keys(val.process)[0]);
                        } else {
                            currSections[key].process = { 0.5: {} };
                            currSections[key].segmentCurrKey = 0.5;
                            currSections[key].processCurrKey = '';
                            currSections[key].processCurrKeyCurrIdx = {};
                        }

                        currSections[key].records = val.records;
                        if (!Object.keys(val.records).length) {
                            currSections[key].records = { 0.5: [] };
                        }
                    });

                    setState({
                        ...state,
                        globalMechanism: currGlobal,
                        globalMechanismCurrKey: init_global_curr_key,
                        sections: currSections,
                    });
                } catch (err: any) {
                    console.log(err);
                    onErr('Failed to import session - make sure its matchs the swc file loaded');
                }
            }
        };
        reader.readAsText(e?.target?.files[0]);
    };

    return { getChangedForm, addNewSection, importJsonParams };
}
