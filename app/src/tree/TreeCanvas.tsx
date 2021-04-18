import React, { useContext, useEffect } from 'react';
import { neuronRadToSize } from '../utils/SwcUtils';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';
import { AppContext } from '../AppContext';
import { useTreeCanvas } from './useTreeCanvas';
import { getStage, root_id } from '../Wrapper';
import { section_color } from '../utils/colors';

function TreeCanvas() {
    const { state, setState } = useContext(AppContext);
    const { updateChildsBelow, checkDeselect, setSelectedId, getLinesArrayNoRoot } = useTreeCanvas();
    //TODO: handle zoom
    const widSize = window.document.getElementById('Canvas')?.offsetWidth;

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

    return (
        <>
            <Stage
                width={state.stage.width}
                height={state.stage.height}
                draggable
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
            >
                <Layer>
                    <Circle
                        radius={neuronRadToSize(state.lines[root_id].radius)}
                        fill={section_color[1]}
                        opacity={state.selectedId === root_id ? 0.8 : 0.3}
                        x={state.stage.rootX}
                        y={state.stage.rootY}
                        draggable={false}
                        onClick={() => setSelectedId(root_id)}
                    />
                    {getLinesArrayNoRoot().map((l) => (
                        <TransformerLine
                            key={l.id}
                            shapeProps={l}
                            isSelected={l.id === state.selectedId}
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

export default TreeCanvas;
