import React, { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { getStage, RenderILine } from '../Wrapper';
import { useSimulateCanvas } from './useSimulateCanvas';
import AnimatedLine from './AnimatedLine';

function TreeCanvas() {
    const { state, setState } = useContext(AppContext);
    const { getLinesArrayNoRoot, updateTree } = useSimulateCanvas();

    const widSize = window.document.getElementById('AnimCanvas')?.offsetWidth;
    const [stageScale, setStageScale] = React.useState(1);
    const [stageCoord, setStageCoord] = React.useState({ x: 0, y: 0 });

    useEffect(() => {
        if (widSize && widSize !== state.stage.width) {
            console.log('changing stage size');
            const newStage = getStage('AnimCanvas');
            const sections = { ...state.sections };
            updateTree(newStage.rootX - state.stage.rootX, newStage.rootY - state.stage.rootY);
            setState({ ...state, sections: sections, stage: newStage });
        }
    }, [widSize, state]);

    const handleWheel = (e: any) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        setStageCoord({
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
        });
        setStageScale(newScale);
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} id={'AnimCanvas'}>
            <AnimatedLine />
        </div>
    );
}

export default TreeCanvas;
