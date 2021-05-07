import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { ISection, mpObj } from '../Wrapper';

export function useSimulate() {
    const { state } = useContext(AppContext);

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
            if (anyProcess || Object.keys(filterMech).length || sec.recording_type !== 0)
                filterSections[sec.id] = {
                    ...state.sections[sec.id],
                    process: filterProcList,
                    mechanism: filterMech,
                };
        }

        return { globalMechanism: filterGlobalMech, sections: filterSections };
    };

    return { getChangedForm };
}
