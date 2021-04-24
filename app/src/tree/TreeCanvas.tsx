import React, { useContext, useEffect } from 'react';
import { neuronRadToSize } from '../utils/swcUtils';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';
import { AppContext } from '../AppContext';
import { useTreeCanvas } from './useTreeCanvas';
import { getStage, root_id } from '../Wrapper';
import { neuron_color } from '../utils/colors';

function TreeCanvas() {
    const { state, setState } = useContext(AppContext);
    const { updateChildsBelow, checkDeselect, setSelectedId, getLinesArrayNoRoot } = useTreeCanvas();
    const widSize = window.document.getElementById('Canvas')?.offsetWidth;
    const [camera, setCamera] = React.useState({ x: 0, y: 0 });

    useEffect(() => {
        if (widSize && widSize !== state.stage.width) {
            console.log('changing stage size');
            const newStage = getStage();
            const lines = { ...state.lines };
            if (Object.keys(lines).length > 0) {
                updateChildsBelow(root_id + 1, newStage.rootX, newStage.rootY);
            }
            setState({ ...state, lines: lines, stage: newStage });
        }
    }, [setState, state, state.lines, widSize]);

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
                        radius={neuronRadToSize(state.lines[root_id].radius)}
                        fill={neuron_color}
                        opacity={state.selectedId === root_id ? 0.8 : 0.3}
                        x={state.stage.rootX}
                        y={state.stage.rootY}
                        draggable={false}
                        onClick={() => setSelectedId(root_id)}
                    />
                    {getLinesArrayNoRoot().map((l) => {
                        if (isOutWidth(l.points[0]) || isOutWidth(l.points[2])) {
                            return null;
                        }
                        if (isOutHeight(l.points[1]) || isOutHeight(l.points[3])) {
                            return null;
                        }
                        return (
                            <>
                                <TransformerLine
                                    key={l.id}
                                    shapeProps={l}
                                    isSelected={l.id === state.selectedId}
                                    onSelect={() => {
                                        setSelectedId(l.id);
                                    }}
                                />
                            </>
                        );
                    })}
                </Layer>
            </Stage>
        </>
    );
}

export default TreeCanvas;
