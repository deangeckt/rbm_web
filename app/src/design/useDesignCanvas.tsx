import { useContext } from 'react';
import { AppContext } from '../Contexts/AppContext';
import { ILine, none_selected } from '../Wrapper';

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
        return [prevX + d * Math.cos(alpha), prevY - d * Math.sin(alpha)];
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

    return { getChildren, updateLinePoint, lengthAlphaToXy, updateChildsBelow, setSelectedId, checkDeselect };
}
