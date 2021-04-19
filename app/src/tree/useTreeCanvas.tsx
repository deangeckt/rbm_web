import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { lengthToPoint, pointToLength } from '../utils/SwcUtils';
import {
    default_alpha,
    default_length,
    default_radius,
    default_tid,
    ILine,
    ISection,
    none_selected,
    root_id,
    section_types,
} from '../Wrapper';

export function useTreeCanvas() {
    const { state, setState } = useContext(AppContext);

    const getChildren = (id: number): number[] => {
        return state.lines[id].lineChilds;
    };

    const getLinesArrayNoRoot = (): ILine[] => {
        const ents = Object.values(state.lines);
        return ents.filter((line) => {
            return line.id !== root_id && line;
        });
    };

    const updateChildsBelow = (startId: number, rootX: number, rootY: number): void => {
        state.lines[root_id].points = [-1, -1, rootX, rootY];
        const ents = Object.values(state.lines);
        for (let i = 0; i < ents.length; i++) {
            const currLine = ents[i];
            if (currLine.id < startId) continue;

            const father = state.lines[currLine.pid];
            currLine.points[0] = father.points[2];
            currLine.points[1] = father.points[3];

            updateLinePoint(currLine);
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
        const alphas = childs.map((c) => state.lines[c].alpha);
        const max_alpha = alphas.length > 0 ? Math.max(...alphas) : 0;
        const newAngle = max_alpha + default_alpha;
        const [newX, newY] = lengthAlphaToXy(lengthToPoint(default_length), newAngle, prevX, prevY);
        const newPoints = [prevX, prevY, newX, newY];
        return { newPoints, newAngle };
    };

    const addNew = () => {
        const lines = { ...state.lines };
        const selectedLine = lines[state.selectedId];
        const newId = state.lastId + 1;

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
        setState({ ...state, lines: lines, selectedId: newId, lastId: newId });
    };

    const getSelectedRadius = () => {
        const selectedLine = state.lines[state.selectedId];
        return selectedLine ? selectedLine.radius : default_radius;
    };

    const getSelectedType = () => {
        const selectedLine = state.lines[state.selectedId];
        return selectedLine ? selectedLine.tid : default_tid;
    };

    const getSelectedAlpha = () => {
        const selectedLine = state.lines[state.selectedId];
        const alpha = selectedLine ? selectedLine.alpha : default_alpha;
        return alpha;
    };

    const getSelectedLength = () => {
        const selectedLine = state.lines[state.selectedId];
        return selectedLine ? pointToLength(selectedLine.length) : default_length;
    };

    const updateSimpleField = (field: 'tid' | 'radius', value: number) => {
        const lines = { ...state.lines };
        const selectedLine = lines[state.selectedId];
        if (!selectedLine) return;
        (selectedLine as any)[field] = value;
        setState({ ...state, lines: lines });
    };

    const updateAlpha = (value: number) => {
        const lines = { ...state.lines };
        const selectedLine = lines[state.selectedId];
        if (!selectedLine) return;

        selectedLine.alpha = value;
        updateLinePoint(selectedLine);
        updateChildsBelow(selectedLine.id, state.stage.rootX, state.stage.rootY);
        setState({ ...state, lines: lines });
    };

    const updateLength = (value: number) => {
        const lines = { ...state.lines };
        const selectedLine = lines[state.selectedId];
        if (!selectedLine) return;

        selectedLine.length = lengthToPoint(value);
        updateLinePoint(selectedLine);
        updateChildsBelow(selectedLine.id, state.stage.rootX, state.stage.rootY);
        setState({ ...state, lines: lines });
    };

    const updateNeuronRad = (value: number) => {
        const lines = { ...state.lines };
        lines[root_id].radius = value;
        setState({ ...state, lines: lines });
    };

    const deleteChildsRecur = (lines: Record<number, ILine>, pid: number): void => {
        const childsIds = getChildren(pid);
        childsIds.forEach((child) => {
            deleteChildsRecur(lines, child);
            delete lines[child];
        });
    };

    const Delete = () => {
        const lines = { ...state.lines };
        const pid = lines[state.selectedId].pid;
        const selectedIdIdxInParent = lines[pid].lineChilds.findIndex((c) => c === state.selectedId);
        lines[pid].lineChilds.splice(selectedIdIdxInParent, 1);
        deleteChildsRecur(lines, state.selectedId);
        delete lines[state.selectedId];
        setState({ ...state, lines: lines, selectedId: pid });
    };

    const addNewSection = (key: string, depth: number): ISection => {
        return {
            key: key,
            depth: depth,
            section: 0.5,
            recording: 'none',
            added: false,
            mechanism: [],
            process: [],
            processKeyIdx: 0,
            mechanismKeyIdx: 0,
        };
    };

    let cid = -1;
    const setCids = (
        lines: Record<string, ILine>,
        sectionLines: Record<string, ISection>,
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
                sectionLines[`${cid}_${tid}`] = addNewSection(`${cid}_${tid}`, depth);
                continue;
            }

            if (lineChilds.length === 1) {
                cid -= 1;
                depth -= 1;
            } else {
                sectionLines[`${cid}_${tid}`] = addNewSection(`${cid}_${tid}`, depth);
            }
            setCids(lines, sectionLines, line.id, tid, depth + 1);
        }
    };

    const setSimulationTreeCids = () => {
        const lines = { ...state.lines };
        const sectionLines = { ...state.sectionLines };
        sectionLines['0_1'] = addNewSection('0_1', 0);
        lines[root_id].cid = 0;
        const ents = Object.values(lines);

        section_types.forEach((sec_type) => {
            const sec_lines = ents.filter((l) => l.tid === sec_type.value);
            if (sec_lines.length > 0) {
                cid = sec_type.value === 1 ? 0 : -1; // on type soma since we have root, start cids from 0
                setCids(lines, sectionLines, root_id, sec_type.value, 1);
            }
        });

        return { sectionLines, lines };
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
