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
    const [scale, setScale] = React.useState(0.5);
    const [stagex, setStagex] = React.useState(0);
    const [stagey, setStagey] = React.useState(0);

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

    const handleWheel = (e: any) => {
        e.evt.preventDefault();

        const scaleBy = 1.2;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const stageX = -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale;
        const stageY = -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale;

        setScale(newScale);
        setStagex(stageX);
        setStagey(stageY);
    };

    return (
        <>
            <Stage
                width={state.stage.width}
                height={state.stage.height}
                draggable
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
                scaleX={scale}
                scaleY={scale}
                x={stagex}
                y={stagey}
                onWheel={handleWheel}
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
