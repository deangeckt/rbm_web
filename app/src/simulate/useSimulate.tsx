import { useContext } from 'react';
import { AppContext } from '../AppContext';
import {
    ILine,
    ISection,
    none_selected,
    recording_types,
    root_id,
    section_types,
    section_short_labels,
    ISectionLine,
} from '../Wrapper';

export function useSimulate() {
    const { state, setState } = useContext(AppContext);
    let cid = -1;

    const setCids = (
        lines: Record<string, ILine>,
        sectionLines: ISectionLine[],
        id: number,
        tid: number,
        depth: number,
    ) => {
        const childs = lines[id].lineChilds;
        for (let i = 0; i < childs.length; i++) {
            const line = lines[childs[i]];
            if (line.tid !== tid) continue;

            cid += 1;

            const lineChilds = lines[line.id].lineChilds;
            line.cid = cid;

            if (lineChilds.length === 0) {
                sectionLines.push({ key: `${cid}_${tid}`, depth: depth });
                continue;
            }

            if (lineChilds.length === 1) cid -= 1;
            else {
                sectionLines.push({ key: `${cid}_${tid}`, depth: depth });
            }
            setCids(lines, sectionLines, line.id, tid, depth + 1);
        }
    };

    const setSimulationTreeCids = () => {
        const lines = { ...state.lines };
        const sectionLines_ = { ...state.sectionTreeLines };
        sectionLines_.push({ key: '0_1', depth: 0 });
        lines[root_id].cid = 0;
        const ents = Object.values(state.lines);
        if (ents.length === 0) return;

        section_types.forEach((sec_type) => {
            const sec_lines = ents.filter((l) => l.tid === sec_type.value);
            if (sec_lines.length > 0) {
                cid = -1;
                setCids(lines, sectionLines_, root_id, sec_type.value, 1);
            }
        });
        console.log('section lines:', sectionLines_);
        setState({ ...state, sectionTreeLines: sectionLines_ });
    };

    const sectionKeyToLabel = (key: string): string => {
        const keys = key.split('_');
        const cid = keys[0];
        const tid = keys[1];
        return `${section_short_labels[tid]}[${cid}]`;
    };

    const getSelectedCid = () => {
        const selectedLine = state.lines[state.selectedId];
        return selectedLine ? selectedLine.cid ?? 0 : 0;
    };

    const updateInput = (id: string, val: number) => {
        const updateInputs = [...state.inputs];
        const currInput = updateInputs.find((ele) => ele.id === id);
        if (!currInput) return;

        currInput.value = val;
        setState({ ...state, inputs: updateInputs });
    };

    const updateStimSimple = (field: string, value: number, idx: number) => {
        const stims = [...state.stims];
        (stims[idx] as any)[field] = value;
        setState({ ...state, stims: stims });
    };

    const updateStimSection = (field: string, value: number, idx: number) => {
        const stims = [...state.stims];
        (stims[idx].section as any)[field] = value;
        setState({ ...state, stims: stims });
    };

    const updateRecordSimple = (field: string, value: any, idx: number) => {
        const records = [...state.records];
        (records[idx] as any)[field] = value;
        setState({ ...state, records: records });
    };

    const updateRecordSection = (field: string, value: number, idx: number) => {
        const records = [...state.records];
        (records[idx].section as any)[field] = value;
        setState({ ...state, records: records });
    };

    const newSection = (): ISection => {
        const selectedLine = state.lines[state.selectedId];
        let newStimId;
        let newStimType;
        if (!selectedLine || state.selectedId === none_selected) {
            newStimType = root_id;
            newStimId = 0;
        } else {
            newStimType = selectedLine.tid;
            newStimId = selectedLine.cid ?? 0;
        }
        return {
            type: newStimType,
            id: newStimId,
            section: 0.5,
        };
    };

    const addStim = () => {
        const stims = [...state.stims];
        stims.push({
            delay: 0,
            duration: 20,
            amplitude: 5,
            section: newSection(),
        });

        setState({ ...state, stims: stims });
    };

    const addRecord = () => {
        const records = [...state.records];
        records.push({
            section: newSection(),
            type: recording_types[0],
        });

        setState({ ...state, records: records });
    };

    const deleteStim = (idx: number) => {
        const stims = [...state.stims];
        stims.splice(idx, 1);
        setState({ ...state, stims: stims });
    };

    const deleteRecord = (idx: number) => {
        const records = [...state.records];
        records.splice(idx, 1);
        setState({ ...state, records: records });
    };

    return {
        setSimulationTreeCids,
        getSelectedCid,
        sectionKeyToLabel,
        addStim,
        addRecord,
        updateInput,
        updateStimSimple,
        updateStimSection,
        updateRecordSimple,
        updateRecordSection,
        deleteStim,
        deleteRecord,
    };
}
