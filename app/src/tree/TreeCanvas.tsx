import React, { useContext, useEffect } from 'react';
import { lineRadiusAddition, neuronRadToSize } from '../utils/swcUtils';
import { Stage, Layer, Circle, Line } from 'react-konva';
import { AppContext } from '../AppContext';
import { useDesignCanvas } from './useDesignCanvas';
import { getStage, RenderILine, root_id, root_key } from '../Wrapper';
import { neuron_color, section_color } from '../utils/colors';
import { useSimulateCanvas } from './useSimulateCanvas';
import { useTreeCanvasCommon } from './useTreeCanvasCommon';

export interface ITreeCanvasProps {
    design: boolean;
}

function TreeCanvas({ design }: ITreeCanvasProps) {
    const { state, setState } = useContext(AppContext);

    const root = design ? root_id : root_key;
    const { checkDeselect, setSelectedId, getLinesArrayNoRoot } = design ? useDesignCanvas() : useSimulateCanvas();
    const { updateChildsBelow } = useDesignCanvas();
    const { updateTree } = useSimulateCanvas();
    const { handleWheel } = useTreeCanvasCommon();

    const widSize = window.document.getElementById('Canvas')?.offsetWidth;
    const [camera, setCamera] = React.useState({ x: 0, y: 0 });
    const [stageScale, setStageScale] = React.useState(1);
    const [stageCoord, setStageCoord] = React.useState({ x: 0, y: 0 });

    useEffect(() => {
        if (widSize && widSize !== state.stage.width) {
            console.log('changing stage size');
            const newStage = getStage('Canvas');
            if (design) {
                const lines = { ...state.designLines };
                updateChildsBelow('1', newStage.rootX, newStage.rootY);
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

    const handleWheelLocal = (e: any) => {
        if (design) return;
        handleWheel(e, setStageCoord, setStageScale);
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
                onWheel={handleWheelLocal}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stageCoord.x}
                y={stageCoord.y}
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
                        if (design) {
                            if (isOutWidth(l.points[0]) || isOutWidth(l.points[2])) {
                                return null;
                            }
                            if (isOutHeight(l.points[1]) || isOutHeight(l.points[3])) {
                                return null;
                            }
                        }
                        return (
                            <Line
                                key={l.id}
                                id={l.id}
                                stroke={section_color[l.tid]}
                                points={[...l.points]}
                                perfectDrawEnabled={false}
                                isSelected={l.id === state.selectedId}
                                onClick={() => setSelectedId(l.id)}
                                opacity={state.selectedId === l.id ? 1 : 0.5}
                                draggable={false}
                                strokeWidth={l.radius + lineRadiusAddition}
                            />
                        );
                    })}
                </Layer>
            </Stage>
        </>
    );
}

export default TreeCanvas;
