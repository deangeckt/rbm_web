import React, { useContext, useEffect } from 'react';
import { lineRadiusAddition, neuronRadToSize } from '../util/swcUtils';
import { Stage, Layer, Circle, Line } from 'react-konva';
import { AppContext } from '../AppContext';
import { useDesignCanvas } from './useDesignCanvas';
import { getStage, RenderILine, root_id, root_key } from '../Wrapper';
import { neuron_color, section_color, selected_color } from '../util/colors';
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

    const onMouseLeave = (e: any) => {
        const container = e.target.getStage().container();
        container.style.cursor = 'default';
    };

    const onMouseEnter = (e: any) => {
        const container = e.target.getStage().container();
        container.style.cursor = 'pointer';
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
                onWheel={handleWheel}
                scaleX={state.stageScale}
                scaleY={state.stageScale}
                x={state.stageCoord.x}
                y={state.stageCoord.y}
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
                        return (
                            <Line
                                key={l.id}
                                id={l.id}
                                stroke={state.selectedId === l.id ? selected_color : section_color[l.tid]}
                                points={[...l.points]}
                                perfectDrawEnabled={false}
                                isSelected={l.id === state.selectedId}
                                onClick={() => setSelectedId(l.id)}
                                // onTouchEnd={() => setSelectedId(l.id)}
                                opacity={state.selectedId === l.id ? 0.5 : 1}
                                draggable={false}
                                strokeWidth={state.selectedId === l.id ? 23 : l.radius + lineRadiusAddition}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                            />
                        );
                    })}
                </Layer>
            </Stage>
        </>
    );
}

export default TreeCanvas;
