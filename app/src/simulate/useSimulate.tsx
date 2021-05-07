import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { default_section_value, init_general_section, ISection, mpObj } from '../Wrapper';

export function useSimulate() {
    const { state } = useContext(AppContext);

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
            general: { ...init_general_section },
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

    const filterProcMech = (mps: mpObj) => {
        const filterMp: mpObj = {};

        const addedKeys = Object.entries(mps)
            .filter(([, mp]) => mp.add)
            .map(([key]) => key);
        addedKeys.forEach((id) => {
            filterMp[id] = { ...mps[id] };
        });

        return filterMp;
    };

    const getChangedForm = (): {
        globalMechanism: mpObj;
        sections: Record<string, ISection>;
    } => {
        const filterGlobalMech: mpObj = filterProcMech(state.globalMechanism);
        const filterSections: Record<string, ISection> = {};

        const sectionEnts = Object.values(state.sections);
        for (let i = 0; i < sectionEnts.length; i++) {
            const sec = sectionEnts[i];

            const filterProcList: Record<number, mpObj> = {};
            let anyProcess = false;
            Object.entries(state.sections[sec.id].process).forEach(([sectionKey, proc]) => {
                filterProcList[Number(sectionKey)] = filterProcMech(proc);
                if (Object.keys(proc).length) anyProcess = true;
            });

            const filterMech = filterProcMech(state.sections[sec.id].mechanism);

            const generalchanged = JSON.stringify(sec.general) !== JSON.stringify(init_general_section);
            if (generalchanged || anyProcess || Object.keys(filterMech).length || sec.recording_type !== 0)
                filterSections[sec.id] = {
                    ...state.sections[sec.id],
                    process: filterProcList,
                    mechanism: filterMech,
                };
        }

        return { globalMechanism: filterGlobalMech, sections: filterSections };
    };

    return { getChangedForm, addNewSection };
}
