import React, { useContext, useEffect } from 'react';
import { neuronRadToSize } from '../utils/swcUtils';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';
import { AppContext } from '../AppContext';
import { useDesignCanvas } from './useDesignCanvas';
import { getStage, RenderILine, root_id, root_key } from '../Wrapper';
import { neuron_color } from '../utils/colors';
import { useSimulateCanvas } from './useSimulateCanvas';

export interface ITreeCanvasProps {
    design: boolean;
}

function TreeCanvas({ design }: ITreeCanvasProps) {
    const { state, setState } = useContext(AppContext);

    const root = design ? root_id : root_key;
    const { checkDeselect, setSelectedId, getLinesArrayNoRoot } = design ? useDesignCanvas() : useSimulateCanvas();
    const { updateChildsBelow } = useDesignCanvas();
    const { updateTree } = useSimulateCanvas();

    const widSize = window.document.getElementById('Canvas')?.offsetWidth;
    const [camera, setCamera] = React.useState({ x: 0, y: 0 });

    useEffect(() => {
        if (widSize && widSize !== state.stage.width) {
            console.log('changing stage size');
            const newStage = getStage();
            if (design) {
                const lines = { ...state.designLines };
                updateChildsBelow('2', newStage.rootX, newStage.rootY);
                setState({ ...state, designLines: lines, stage: newStage });
            } else {
                const sections = { ...state.sections };
                updateTree(newStage.rootX - state.stage.rootX, newStage.rootY - state.stage.rootY);
                setState({ ...state, sections: sections, stage: newStage });
            }
        }
    }, [setState, state, state.designLines, widSize]);

    const handleDragEnd = (e: any) => {
        setCamera({
            x: -e.target.x(),
            y: -e.target.y(),
        });
    };

    const isOutWidth = (x: number): boolean => {
        return x < camera.x || x > camera.x + state.stage.width;
    };

    const isOutHeight = (y: number): boolean => {
        return y < camera.y || y > camera.y + state.stage.height;
    };

    return (
        <>
            <Stage
                pixelRatio={1}
                width={state.stage.width}
                height={state.stage.height}
                draggable
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
                onDragEnd={handleDragEnd}
            >
                <Layer>
                    <Circle
                        radius={neuronRadToSize(state.designLines[root_id].radius)}
                        fill={neuron_color}
                        opacity={state.selectedId === root ? 0.8 : 0.3}
                        x={state.stage.rootX}
                        y={state.stage.rootY}
                        draggable={false}
                        onClick={() => setSelectedId(root)}
                    />
                    {getLinesArrayNoRoot().map((l: RenderILine) => {
                        if (isOutWidth(l.points[0]) || isOutWidth(l.points[2])) {
                            return null;
                        }
                        if (isOutHeight(l.points[1]) || isOutHeight(l.points[3])) {
                            return null;
                        }
                        return (
                            <TransformerLine
                                key={l.id}
                                line={l}
                                isSelected={l.id === state.selectedId}
                                click={() => setSelectedId(l.id)}
                            />
                        );
                    })}
                </Layer>
            </Stage>
        </>
    );
}

export default TreeCanvas;
