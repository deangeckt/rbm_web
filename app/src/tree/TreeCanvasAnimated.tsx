import React from 'react';
import { Stage, Layer } from 'react-konva';
import { RenderILine } from '../Wrapper';
import AnimatedLine from './AnimatedLine';
import { useSimulateCanvas } from './useSimulateCanvas';

export interface AnimProps {
    from: string;
    to: string;
    dur: number;
}

const animList: AnimProps[] = [
    {
        from: 'red',
        to: 'blue',
        dur: 500,
    },
    {
        from: 'blue',
        to: 'green',
        dur: 500,
    },
    {
        from: 'green',
        to: 'yellow',
        dur: 500,
    },
];

const TreeCanvasAnimated = () => {
    // TODO - common code..
    const [stageScale, setStageScale] = React.useState(1);
    const [stageCoord, setStageCoord] = React.useState({ x: 0, y: 0 });

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

    const randColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };
    const { getLinesArrayNoRoot } = useSimulateCanvas();
    const randomAnimPropsPerLine: Record<string, AnimProps[]> = {};
    const lines = getLinesArrayNoRoot();
    for (let i = 0; i < lines.length; i++) {
        const ap = animList.map((a) => ({ ...a }));
        ap[0].from = randColor();
        const colorTwo = randColor();
        ap[0].to = colorTwo;
        ap[1].from = colorTwo;
        const colorThree = randColor();
        ap[1].to = colorThree;
        ap[2].from = colorThree;
        randomAnimPropsPerLine[lines[i].id] = ap;
    }

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            draggable
            onWheel={handleWheel}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stageCoord.x}
            y={stageCoord.y}
        >
            <Layer>
                {lines.map((l: RenderILine) => {
                    return <AnimatedLine key={l.id} line={l} animProps={randomAnimPropsPerLine[l.id]} />;
                })}
            </Layer>
        </Stage>
    );
};

export default TreeCanvasAnimated;
