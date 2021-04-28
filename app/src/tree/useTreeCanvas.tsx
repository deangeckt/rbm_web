import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { lengthToPoint, pointToLength } from '../utils/swcUtils';
import {
    default_alpha,
    default_length,
    default_radius,
    default_section_value,
    default_tid,
    ILine,
    ISection,
    none_selected,
    root_id,
    root_key,
    section_types,
} from '../Wrapper';

export function useTreeCanvas() {
    const { state, setState } = useContext(AppContext);

    const getChildren = (id: number): number[] => {
        return state.designLines[id].lineChilds;
    };

    const getLinesArrayNoRoot = (): ILine[] => {
        const ents = Object.values(state.designLines);
        return ents.filter((line) => {
            return line.id !== root_id && line;
        });
    };

    const updateChildsBelow = (startId: number, rootX: number, rootY: number): void => {
        state.designLines[root_id].points = [-1, -1, rootX, rootY];
        const ents = Object.values(state.designLines);
        for (let i = 0; i < ents.length; i++) {
            const currLine = ents[i];
            if (currLine.id < startId) continue;

            const father = state.designLines[currLine.pid];
            currLine.points[0] = father.points[2];
            currLine.points[1] = father.points[3];

            updateLinePoint(currLine);
        }
    };

    const updateTreeLocation = (x_delta: number, y_delta: number): void => {
        const ents = Object.values(state.designLines);
        for (let i = 0; i < ents.length; i++) {
            const currLine = ents[i];
            if (currLine.id === root_id) continue;
            for (let i = 0; i < currLine.points.length; i++) {
                if (i % 2 === 0) currLine.points[i] += x_delta;
                else currLine.points[i] += y_delta;
            }
        }
    };

    const updateLinePoint = (line: ILine) => {
        const prevX = line.points[0];
        const prevY = line.points[1];
        const [newX, newY] = lengthAlphaToXy(line.length, line.alpha, prevX, prevY);
        line.points[2] = newX;
        line.points[3] = newY;
    };

    const lengthAlphaToXy = (d: number, alpha: number, prevX: number, prevY: number) => {
        return [prevX + d * Math.cos(alpha * Math.PI), prevY - d * Math.sin(alpha * Math.PI)];
    };

    const setSelectedId = (id: number) => {
        setState({ ...state, selectedId: id });
    };

    const checkDeselect = (e: any) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(none_selected);
        }
    };

    const addNewPoints = (prevX: number, prevY: number, childs: number[]) => {
        const alphas = childs.map((c) => state.designLines[c].alpha);
        const max_alpha = alphas.length > 0 ? Math.max(...alphas) : 0;
        const newAngle = max_alpha + default_alpha;
        const [newX, newY] = lengthAlphaToXy(lengthToPoint(default_length), newAngle, prevX, prevY);
        const newPoints = [prevX, prevY, newX, newY];
        return { newPoints, newAngle };
    };

    const addNew = () => {
        const lines = { ...state.designLines };
        const selectedLine = lines[state.selectedId];
        const newId = state.designLastAddedId + 1;

        const prevX = selectedLine.points[2];
        const prevY = selectedLine.points[3];
        const r = addNewPoints(prevX, prevY, getChildren(selectedLine.id));
        const newPoints = r.newPoints;
        const newPid = selectedLine.id;

        lines[newPid].lineChilds.push(newId);
        lines[newId] = {
            id: newId,
            points: newPoints,
            pid: newPid,
            radius: default_radius,
            tid: default_tid,
            length: lengthToPoint(default_length),
            alpha: r.newAngle,
            lineChilds: [],
        };
        setState({ ...state, designLines: lines, selectedId: newId, designLastAddedId: newId });
    };

    const getSelectedRadius = () => {
        const selectedLine = state.designLines[state.selectedId];
        return selectedLine ? selectedLine.radius : default_radius;
    };

    const getSelectedType = () => {
        const selectedLine = state.designLines[state.selectedId];
        return selectedLine ? selectedLine.tid : default_tid;
    };

    const getSelectedAlpha = () => {
        const selectedLine = state.designLines[state.selectedId];
        const alpha = selectedLine ? selectedLine.alpha : default_alpha;
        return alpha;
    };

    const getSelectedLength = () => {
        const selectedLine = state.designLines[state.selectedId];
        return selectedLine ? pointToLength(selectedLine.length) : default_length;
    };

    const updateSimpleField = (field: 'tid' | 'radius', value: number) => {
        const lines = { ...state.designLines };
        const selectedLine = lines[state.selectedId];
        if (!selectedLine) return;
        (selectedLine as any)[field] = value;
        setState({ ...state, designLines: lines });
    };

    const updateAlpha = (value: number) => {
        const lines = { ...state.designLines };
        const selectedLine = lines[state.selectedId];
        if (!selectedLine) return;

        selectedLine.alpha = value;
        updateLinePoint(selectedLine);
        updateChildsBelow(selectedLine.id, state.stage.rootX, state.stage.rootY);
        setState({ ...state, designLines: lines });
    };

    const updateLength = (value: number) => {
        const lines = { ...state.designLines };
        const selectedLine = lines[state.selectedId];
        if (!selectedLine) return;

        selectedLine.length = lengthToPoint(value);
        updateLinePoint(selectedLine);
        updateChildsBelow(selectedLine.id, state.stage.rootX, state.stage.rootY);
        setState({ ...state, designLines: lines });
    };

    const updateNeuronRad = (value: number) => {
        const lines = { ...state.designLines };
        lines[root_id].radius = value;
        setState({ ...state, designLines: lines });
    };

    const deleteChildsRecur = (lines: Record<number, ILine>, pid: number): void => {
        const childsIds = getChildren(pid);
        childsIds.forEach((child) => {
            deleteChildsRecur(lines, child);
            delete lines[child];
        });
    };

    const Delete = () => {
        const lines = { ...state.designLines };
        const pid = lines[state.selectedId].pid;
        const selectedIdIdxInParent = lines[pid].lineChilds.findIndex((c) => c === state.selectedId);
        lines[pid].lineChilds.splice(selectedIdIdxInParent, 1);
        deleteChildsRecur(lines, state.selectedId);
        delete lines[state.selectedId];
        setState({ ...state, designLines: lines, selectedId: pid });
    };

    const addNewSection = (key: string, swc_id: number): ISection => {
        return {
            key: key,
            section: default_section_value,
            recording_type: 0,
            mechanism: {},
            process: {},
            mechanismCurrKey: '',
            processCurrKey: '',
            children: [],
            swc_id: swc_id,
        };
    };

    let cid = -1;
    const setCids = (
        lines: Record<string, ILine>,
        sections: Record<string, ISection>,
        id: number,
        tid: number,
        pidKey: string,
    ) => {
        const childs = lines[id].lineChilds;
        for (let i = 0; i < childs.length; i++) {
            const line = lines[childs[i]];
            if (line.tid !== tid) continue;

            cid += 1;
            const lineChilds = lines[line.id].lineChilds;

            const key = `${cid}_${tid}`;
            if (!sections[key]) {
                sections[key] = addNewSection(key, line.id);
                sections[pidKey].children.push(key);
            }

            if (lineChilds.length === 0) {
                continue;
            }

            if (lineChilds.length === 1) {
                cid -= 1;
            }
            setCids(lines, sections, line.id, tid, key);
        }
    };

    const setSimulationTreeCids = () => {
        const lines = { ...state.designLines };
        const sections = { ...state.sections };
        sections[root_key] = addNewSection(root_key, root_id);
        const ents = Object.values(lines);

        section_types.forEach((sec_type) => {
            const sec_lines = ents.filter((l) => l.tid === sec_type.value);
            if (sec_lines.length > 0) {
                const startPid = sec_lines[0].pid !== -1 ? sec_lines[0].pid : root_id;
                cid = sec_type.value === 1 ? 0 : -1; // on type soma since we have root, start cids from 0
                setCids(lines, sections, startPid, sec_type.value, root_key);
            }
        });

        // const ilines: Record<string, ILine> = {};

        // Object.entries(sectionLines);

        console.log(lines);
        console.log(sections);

        return { sections };
    };

    return {
        setSimulationTreeCids,
        getLinesArrayNoRoot,
        updateChildsBelow,
        setSelectedId,
        checkDeselect,
        addNew,
        Delete,
        getSelectedLength,
        getSelectedAlpha,
        getSelectedRadius,
        getSelectedType,
        updateSimpleField,
        updateAlpha,
        updateLength,
        updateNeuronRad,
    };
}
