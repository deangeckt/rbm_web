import React, { useContext, useEffect } from 'react';
import { root_id } from './Design';
import { neuronRadToSize } from '../Utils/SwcUtils';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';
import { colors } from '../colors';
import { AppContext } from '../Contexts/AppContext';


export interface IStageSize {
	width: number;
	height: number;
	rootX: number;
	rootY: number;
}

export const getStage = (): IStageSize => {
	const canvas_part_size = 0.7; //this is the css value of the partial width
	const canvas_hegiht = window.document.getElementById("Canvas")?.offsetHeight ?? window.innerHeight;
	const canvas_width = window.document.getElementById("Canvas")?.offsetWidth ?? window.innerWidth * canvas_part_size;
	return {
		width: canvas_width,
		height: canvas_hegiht,
		rootX: canvas_width / 2,
		rootY: canvas_hegiht / 2 + 50
	}
}

export const initialStage: IStageSize = getStage();

export interface IDesignCanvasProps {
    // edit mode
    checkDeselect?: (e: any) => void;
    selectedId: number;
    setSelectedId: Function;
}

function DesignCanvas({checkDeselect, selectedId, setSelectedId}: IDesignCanvasProps) {
    const [stage, setStage] = React.useState(initialStage);
	const {state} = useContext(AppContext);

    // BUG HERE!
    // TODO: FIX Stage Size in case screen is getting bigger/ smaller -> speically in simulation page
	const widSize = window.document.getElementById("Canvas")?.offsetWidth;
	useEffect(() => {
		if (widSize) {
			console.log('main render');
			setStage(getStage());
            // basically need to update children recur like below, react call backs :(
			// getRootChildren().forEach(c => {
			// 	updateChildsRecur(c);
			// });
            // also need to fix the usage of rootX in designer - in addNew()
		}
  }, [widSize]);
	return (
	<>
        <Stage width={stage.width} height={stage.height} draggable
            onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
            <Layer>
                <Circle
                    radius={neuronRadToSize(state.neuronRadius)}
                    fill={colors.primary}
                    opacity={selectedId === root_id ? 0.8 : 0.3}
                    x={stage.rootX}
                    y={stage.rootY}
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
