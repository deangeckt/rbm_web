import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
import { ILine } from "../Wrapper";

export function useDesignCanvas() {
    const {state} = useContext(AppContext);

    const getChildren = (lid: number) => {
		const lines = state.lines;
		return lines.filter((line) => line.pid === lid);
	}

    const updateChildsRecur = (father: ILine): void => {
        const childs = getChildren(father.id);
        childs.forEach(child => {
            child.points[0] = father.points[2];
            child.points[1] = father.points[3];
            updateLinePoint(child);
            updateChildsRecur(child);
        });
    }

    const updateLinePoint = (line: ILine) =>{
		const prevX = line.points[0];
		const prevY = line.points[1];
		const [newX, newY] = lengthAlphaToXy(line.length, line.alpha, prevX, prevY);
		line.points[2] = newX;
		line.points[3] = newY;
	}

    const lengthAlphaToXy = (d: number, alpha: number, prevX: number, prevY: number) => {
		return [prevX + d * Math.cos(alpha), (prevY - d * Math.sin(alpha))];
	}

    return {getChildren, updateChildsRecur, updateLinePoint, lengthAlphaToXy};
}