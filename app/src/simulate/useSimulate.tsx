import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { TreeLines } from '../utils/TreeLines';
import { ISection, none_selected, recording_types, root_id, section_types } from '../Wrapper';

export function useSimulate() {
    const { state, setState } = useContext(AppContext);

    const setSimulationTreeCids = () => {
        const lines = [...state.lines];
        if (lines.length === 0) return;

        section_types.forEach((sec_type) => {
            const sec_lines = lines.filter((l) => l.tid === sec_type.value);
            if (sec_lines.length > 0) {
                const tree = new TreeLines(root_id);
                sec_lines.forEach((line) => {
                    tree.insert(line);
                });
                tree.setCid();
            }
        });
        setState({ ...state, lines: lines });
    };

    const getSelectedCid = () => {
        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
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
        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
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
