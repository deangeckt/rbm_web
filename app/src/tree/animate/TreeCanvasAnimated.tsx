import React from 'react';
import { Stage, Layer } from 'react-konva';
import { RenderILine } from '../../Wrapper';
import AnimatedLine from './AnimatedLine';
import { useSimulateCanvas } from '../useSimulateCanvas';
import { useTreeCanvasCommon } from '../useTreeCanvasCommon';
import { Button } from '@material-ui/core';

export interface AnimProps {
    from: string;
    to: string;
    dur: number;
}

const animList: AnimProps[] = [
    {
        from: 'red',
        to: 'blue',
        dur: 1500,
    },
    {
        from: 'blue',
        to: 'green',
        dur: 1500,
    },
    {
        from: 'green',
        to: 'red',
        dur: 1500,
    },
];

export interface ITreeCanvasAnimatedProps {
    display: boolean;
}

const TreeCanvasAnimated = ({ display }: ITreeCanvasAnimatedProps) => {
    const { handleWheel } = useTreeCanvasCommon();
    const { getLinesArrayNoRoot } = useSimulateCanvas();

    const [stageScale, setStageScale] = React.useState(1);
    const [stageCoord, setStageCoord] = React.useState({ x: 0, y: 0 });
    const [startAnim, setStartAnim] = React.useState(false);

    const randColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    const randomAnimPropsPerLine: Record<string, AnimProps[]> = {};
    const lines = getLinesArrayNoRoot();
    for (let i = 0; i < lines.length; i++) {
        const ap = animList.map((a) => ({ ...a }));
        // ap[0].from = randColor();
        // const colorTwo = randColor();
        // ap[0].to = colorTwo;
        // ap[1].from = colorTwo;
        // const colorThree = randColor();
        // ap[1].to = colorThree;
        // ap[2].from = colorThree;
        randomAnimPropsPerLine[lines[i].id] = ap;
    }

    return (
        <div style={{ display: display ? undefined : 'none', width: '100%', height: '100%' }}>
            <Button
                className="NoCapsButton"
                variant={'outlined'}
                color="primary"
                onClick={() => setStartAnim(!startAnim)}
            >
                {startAnim ? 'Stop' : 'Start'}
            </Button>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                draggable
                onWheel={(e) => handleWheel(e, setStageCoord, setStageScale)}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stageCoord.x}
                y={stageCoord.y}
            >
                <Layer>
                    {lines.map((l: RenderILine) => {
                        return (
                            <AnimatedLine
                                key={l.id}
                                line={l}
                                animProps={randomAnimPropsPerLine[l.id]}
                                start={startAnim}
                            />
                        );
                    })}
                </Layer>
            </Stage>
        </div>
    );
};

export default TreeCanvasAnimated;
