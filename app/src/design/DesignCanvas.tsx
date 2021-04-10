import React, { useContext, useEffect } from 'react';
import { neuronRadToSize } from '../utils/SwcUtils';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';
import { colors } from '../colors';
import { AppContext } from '../Contexts/AppContext';
import { useDesignCanvas } from './useDesignCanvas';
import { getStage, root_id } from '../Wrapper';

function DesignCanvas() {
    const { state, setState } = useContext(AppContext);
    const { updateLinePoint, updateChildsBelow, checkDeselect, setSelectedId } = useDesignCanvas();
    //TODO: handle zoom and catch this event and render right after
    const widSize = window.document.getElementById('Canvas')?.offsetWidth;

    useEffect(() => {
        if (widSize && widSize !== state.stage.width) {
            console.log('changing stage size');
            const newStage = getStage();
            const lines = [...state.lines];
            if (lines.length > 0) {
                updateChildsBelow(lines, lines[0].id, newStage.rootX, newStage.rootY);
            }
            setState({ ...state, lines: lines, stage: newStage });
        }
    }, [setState, state, state.lines, updateLinePoint, widSize]);

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
                        radius={neuronRadToSize(state.neuronRadius)}
                        fill={colors.primary}
                        opacity={state.selectedId === root_id ? 0.8 : 0.3}
                        x={state.stage.rootX}
                        y={state.stage.rootY}
                        draggable={false}
                        onClick={() => setSelectedId(root_id)}
                    />
                    {state.lines.map((l) => (
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

export default DesignCanvas;
