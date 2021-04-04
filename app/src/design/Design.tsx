import React, { useContext } from 'react';
import ControlPanel from './ControlPanel';
import { lengthToPoint, pointToLength } from '../utils/SwcUtils';
import TopPanel from './TopPanel';
import DesignCanvas from './DesignCanvas';
import './Design.css';
import Navigation from './Navigation';
import { ILine } from '../Wrapper';
import { AppContext } from '../Contexts/AppContext';
import { useDesignCanvas } from './useDesignCanvas';

const default_radius = 0.1; // in micro
const default_tid = 0;
const default_length = 10; //in micro
export const default_alpha = Math.PI * 0.1;
export const root_id = 1;
const none_selected = -1;

const Design = () => {
    const { state, setState } = useContext(AppContext);
    const [selectedId, setSelectedId] = React.useState(root_id);
    const { getChildren, updateChildsRecur, updateLinePoint, lengthAlphaToXy } = useDesignCanvas();

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
        const selectedLine = lines.find((line) => line.id === selectedId);
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
        setState({ ...state, lines: lines });
        setSelectedId(newId);
    };

    const getSelectedRadius = () => {
        const selectedLine = state.lines.find((line) => line.id === selectedId);
        return selectedLine ? selectedLine.radius : default_radius;
    };

    const getSelectedType = () => {
        const selectedLine = state.lines.find((line) => line.id === selectedId);
        return selectedLine ? selectedLine.tid : default_tid;
    };

    const updateSimpleField = (field: 'tid' | 'radius', value: number) => {
        if (field === 'radius' && value <= 0) return;
        const lines = [...state.lines];
        const selectedLine = lines.find((line) => line.id === selectedId);
        (selectedLine as any)[field] = value;
        setState({ ...state, lines: lines });
    };

    const getSelectedAlpha = () => {
        const selectedLine = state.lines.find((line) => line.id === selectedId);
        const alpha = selectedLine ? selectedLine.alpha : default_alpha;
        return alpha / Math.PI;
    };

    const getSelectedLength = () => {
        const selectedLine = state.lines.find((line) => line.id === selectedId);
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
        const selectedLine = lines.find((line) => line.id === selectedId);
        if (!selectedLine) return;

        selectedLine.alpha = value * Math.PI;
        updateLinePoint(selectedLine);
        updateChildsRecur(selectedLine);
        setState({ ...state, lines: lines });
    };

    const updateLength = (value: number) => {
        if (value <= 0) return;
        const lines = [...state.lines];
        const selectedLine = state.lines.find((line) => line.id === selectedId);
        if (!selectedLine) return;

        selectedLine.length = lengthToPoint(value);
        updateLinePoint(selectedLine);
        updateChildsRecur(selectedLine);
        setState({ ...state, lines: lines });
    };

    const Delete = () => {
        const lines = [...state.lines];
        const index = lines.findIndex((line) => line.id === selectedId);
        if (index === -1) return;

        const parentId = lines[index].pid;
        deleteChildsRecur(lines, index);
        setState({ ...state, lines: lines });
        setSelectedId(parentId);
    };

    const setNextChildSelected = () => {
        if (selectedId === none_selected) return;

        let childs: ILine[];
        if (selectedId === root_id) {
            childs = getChildren(root_id);
        } else {
            const selectedLine = state.lines.find((line) => line.id === selectedId);
            childs = getChildren(selectedLine!.id);
        }

        if (childs.length === 0) return;

        setSelectedId(childs[0].id);
    };

    const setBackChildSelected = () => {
        if (selectedId === none_selected || selectedId === root_id) return;

        const selectedLine = state.lines.find((line) => line.id === selectedId);
        setSelectedId(selectedLine!.pid);
    };

    const setBrotherChildSelected = () => {
        if (selectedId === none_selected || selectedId === root_id) return;

        const selectedLine = state.lines.find((line) => line.id === selectedId);
        const childs = getChildren(selectedLine!.pid);

        if (childs.length === 1) return;

        const nextIdx = childs.findIndex((l) => l.id === selectedLine!.id) + 1;
        const nextId = childs[nextIdx % childs.length].id;

        setSelectedId(nextId);
    };

    return (
        <div className="Design">
            <div className="TopPanel">
                <TopPanel />
            </div>
            <div className="MainPanel">
                <div className="Canvas" id={'Canvas'}>
                    <DesignCanvas checkDeselect={checkDeselect} selectedId={selectedId} setSelectedId={setSelectedId} />
                </div>
                <div className="ControlPanel">
                    <ControlPanel
                        addNew={addNew}
                        Delete={Delete}
                        getSelectedLength={getSelectedLength}
                        getSelectedAlpha={getSelectedAlpha}
                        getSelectedRadius={getSelectedRadius}
                        getSelectedType={getSelectedType}
                        updateSimpleField={updateSimpleField}
                        updateAlpha={updateAlpha}
                        updateLength={updateLength}
                        neuronSelected={selectedId === root_id}
                        lineSelected={selectedId !== none_selected && selectedId !== root_id}
                    />
                    {selectedId !== none_selected ? (
                        <Navigation
                            setNext={setNextChildSelected}
                            setBack={setBackChildSelected}
                            setBrother={setBrotherChildSelected}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
};
export default Design;
