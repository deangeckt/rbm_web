import React, { useContext, useEffect } from 'react';
import { root_id } from './Design';
import { neuronRadToSize } from '../Utils/SwcUtils';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';
import { colors } from '../colors';
import { AppContext } from '../Contexts/AppContext';
import { useDesignCanvas } from './useDesignCanvas';
import { getStage } from '../Wrapper';

export interface IDesignCanvasProps {
    checkDeselect?: (e: any) => void;
    selectedId: number;
    setSelectedId: Function;
}

function DesignCanvas({checkDeselect, selectedId, setSelectedId}: IDesignCanvasProps) {
	const {state, setState} = useContext(AppContext);
    const {updateChildsRecur, updateLinePoint} = useDesignCanvas();
    //TODO: handle zoom and catch this event and render right after
	const widSize = window.document.getElementById("Canvas")?.offsetWidth;

	useEffect(() => {
		if (widSize && widSize !== state.stage.width) {
			console.log('changing stage size');
            const newStage = getStage();
            const lines = [...state.lines];
            const root_childs =  lines.filter((line) => line.pid === root_id);
			root_childs.forEach(c => {
                c.points[0] = newStage.rootX;
                c.points[1] = newStage.rootY;
                updateLinePoint(c);
				updateChildsRecur(c);
			});
            setState({...state, lines: lines, stage: newStage});
		}
  }, [setState, state, state.lines, updateChildsRecur, updateLinePoint, widSize]);

	return (
	<>
        <Stage width={state.stage.width} height={state.stage.height} draggable
            onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
            <Layer>
                <Circle
                    radius={neuronRadToSize(state.neuronRadius)}
                    fill={colors.primary}
                    opacity={selectedId === root_id ? 0.8 : 0.3}
                    x={state.stage.rootX}
                    y={state.stage.rootY}
                    draggable={false}
                    onClick={() => setSelectedId(root_id)}
                />
                {state.lines.map((l) => (
                    <TransformerLine
                        key={l.id}
                        shapeProps={l}
                        isSelected={l.id === selectedId}
                        onSelect={() => {
                            setSelectedId(l.id);
                        }}
                    />
                ))}
            </Layer>
        </Stage>
	</>
  );
}

export default DesignCanvas;
