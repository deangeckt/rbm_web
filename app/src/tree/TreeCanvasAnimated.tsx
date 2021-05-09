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

const TCA = () => {
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
    console.log(randomAnimPropsPerLine);

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} draggable>
            <Layer>
                {lines.map((l: RenderILine) => {
                    return <AnimatedLine key={l.id} line={l} animList={randomAnimPropsPerLine[l.id]} />;
                })}
            </Layer>
        </Stage>
    );
};

export default TCA;
