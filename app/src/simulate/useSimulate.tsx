import { useContext } from 'react';
import { AppContext } from '../Contexts/AppContext';
import { ISection, none_selected, recording_types, root_id } from '../Wrapper';

export function useSimulate() {
    const { state, setState } = useContext(AppContext);

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
            newStimId = selectedLine.cid ?? 0; //TODO: calculate cid per line when Sim.tsx is up
        }
        return {
            type: newStimType,
            id: newStimId,
            section: 0.5,
        };
    };

    const addStim = (closeDialogForm = false) => {
        const stims = [...state.stims];
        stims.push({
            delay: 0,
            duration: 20,
            amplitude: 5,
            section: newSection(),
        });

        const dialogs = { ...state.dialogs };
        closeDialogForm && (dialogs.dialogNewForm = false);
        setState({ ...state, stims: stims, dialogs: dialogs });
    };

    const addRecord = (closeDialogForm = false) => {
        const records = [...state.records];
        records.push({
            section: newSection(),
            type: recording_types[0],
        });

        const dialogs = { ...state.dialogs };
        closeDialogForm && (dialogs.dialogNewForm = false);
        setState({ ...state, records: records, dialogs: dialogs });
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
