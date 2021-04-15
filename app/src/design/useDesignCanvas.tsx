import { useContext } from 'react';
import { AppContext } from '../Contexts/AppContext';
import { lengthToPoint, pointToLength } from '../utils/SwcUtils';
import { default_alpha, default_length, default_radius, default_tid, ILine, none_selected, root_id } from '../Wrapper';

export function useDesignCanvas() {
    const { state, setState } = useContext(AppContext);

    const getChildren = (lid: number) => {
        const lines = state.lines;
        return lines.filter((line) => line.pid === lid);
    };

    const updateChildsBelow = (ilines: ILine[], startId: number, rootX: number, rootY: number): void => {
        for (let i = 0; i < ilines.length; i++) {
            const currLine = ilines[i];
            if (currLine.id < startId) continue;
            const father = ilines.find((l) => l.id === currLine.pid);
            if (!father) {
                console.log('looking for root');
                currLine.points[0] = rootX;
                currLine.points[1] = rootY;
            } else {
                currLine.points[0] = father.points[2];
                currLine.points[1] = father.points[3];
            }
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

    const addNewPoints = (prevX: number, prevY: number, childs: ILine[]) => {
        const alphas = childs.map((c) => c.alpha);
        const max_alpha = alphas.length > 0 ? Math.max(...alphas) : 0;
        const newAngle = max_alpha + default_alpha;
        const [newX, newY] = lengthAlphaToXy(lengthToPoint(default_length), newAngle, prevX, prevY);
        const newPoints = [prevX, prevY, newX, newY];
        return { newPoints, newAngle };
    };

    const addNew = () => {
        const lines = [...state.lines];
        const selectedLine = lines.find((line) => line.id === state.selectedId);
        let newId: number;
        let newPid: number;
        let newPoints: number[] = [];
        let newAlpha: number;

        if (!selectedLine) {
            const rootChilds = getChildren(root_id);
            const r = addNewPoints(state.stage.rootX, state.stage.rootY, rootChilds);
            newPoints = r.newPoints;
            newAlpha = r.newAngle;
            newPid = root_id;
            newId = rootChilds.length === 0 ? root_id + 1 : lines[lines.length - 1].id + 1;
        } else {
            const prevX = selectedLine.points[2];
            const prevY = selectedLine.points[3];
            const r = addNewPoints(prevX, prevY, getChildren(selectedLine.id));
            newPoints = r.newPoints;
            newAlpha = r.newAngle;
            newId = lines[lines.length - 1].id + 1;
            newPid = selectedLine.id;
        }
        lines.push({
            id: newId,
            points: newPoints,
            pid: newPid,
            radius: default_radius,
            tid: default_tid,
            length: lengthToPoint(default_length),
            alpha: newAlpha,
        });
        setState({ ...state, lines: lines, selectedId: newId });
    };

    const getSelectedRadius = () => {
        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
        return selectedLine ? selectedLine.radius : default_radius;
    };

    const getSelectedType = () => {
        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
        return selectedLine ? selectedLine.tid : default_tid;
    };

    const updateSimpleField = (field: 'tid' | 'radius', value: number) => {
        if (field === 'radius' && value <= 0) return;
        const lines = [...state.lines];
        const selectedLine = lines.find((line) => line.id === state.selectedId);
        (selectedLine as any)[field] = value;
        setState({ ...state, lines: lines });
    };

    const getSelectedAlpha = () => {
        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
        const alpha = selectedLine ? selectedLine.alpha : default_alpha;
        return alpha;
    };

    const getSelectedLength = () => {
        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
        return selectedLine ? pointToLength(selectedLine.length) : default_length;
    };

    const deleteChildsRecur = (lines: ILine[], fatherIdx: number): void => {
        const childs = lines.filter((line) => line.pid === lines[fatherIdx].id); //use map to return idx?
        childs.forEach((child) => {
            const childIdx = lines.findIndex((line) => line.id === child.id);
            deleteChildsRecur(lines, childIdx);
        });
        lines.splice(fatherIdx, 1);
    };

    const updateAlpha = (value: number) => {
        const lines = [...state.lines];
        const selectedLine = lines.find((line) => line.id === state.selectedId);
        if (!selectedLine) return;

        selectedLine.alpha = value;
        updateLinePoint(selectedLine);
        updateChildsBelow(lines, selectedLine.id, state.stage.rootX, state.stage.rootY);
        setState({ ...state, lines: lines });
    };

    const updateLength = (value: number) => {
        if (value <= 0) return;
        const lines = [...state.lines];
        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
        if (!selectedLine) return;

        selectedLine.length = lengthToPoint(value);
        updateLinePoint(selectedLine);
        updateChildsBelow(lines, selectedLine.id, state.stage.rootX, state.stage.rootY);
        setState({ ...state, lines: lines });
    };

    const Delete = () => {
        const lines = [...state.lines];
        const index = lines.findIndex((line) => line.id === state.selectedId);
        if (index === -1) return;

        const parentId = lines[index].pid;
        deleteChildsRecur(lines, index);
        setState({ ...state, lines: lines, selectedId: parentId });
    };

    return {
        getChildren,
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
    };
}
