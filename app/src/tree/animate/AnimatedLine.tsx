import React from 'react';
import { Spring, animated } from '@react-spring/konva';
import { lineRadiusAddition } from '../../utils/swcUtils';
import { RenderILine } from '../../Wrapper';
import { AnimProps } from './TreeCanvasAnimated';
import { Line } from 'react-konva';

export interface AnimatedLinedProps {
    line: RenderILine;
    animProps: AnimProps[];
    start: boolean;
}

const AnimatedLine = ({ line, animProps, start }: AnimatedLinedProps) => {
    const advanceAnim = (idx: number) => {
        const newIdx = idx === animList.length ? 0 : idx;
        setAnim(animList[newIdx]);
    };

    const renderNoneAnim = () => {
        return (
            <Line
                points={[...line.points]}
                strokeWidth={line.radius + lineRadiusAddition}
                draggable={false}
                perfectDrawEnabled={false}
                stroke={animProps[0].from}
            />
        );
    };

    const renderNewAnim = (idx: number) => {
        return (
            <Spring
                from={{ stroke: animProps[idx].from }}
                to={{ stroke: animProps[idx].to }}
                config={{ duration: animProps[idx].dur }}
                onRest={() => advanceAnim(idx + 1)}
            >
                {(props) => (
                    <animated.Line
                        {...props}
                        points={[...line.points]}
                        strokeWidth={line.radius + lineRadiusAddition}
                        draggable={false}
                        perfectDrawEnabled={false}
                    />
                )}
            </Spring>
        );
    };

    const propsToAnims = () => {
        const anims = animProps.map((_ap, i) => {
            return renderNewAnim(i);
        });
        return anims;
    };

    const [animList] = React.useState(propsToAnims());
    const [anim, setAnim] = React.useState(animList[0]);

    return start ? anim : renderNoneAnim();
};
export default AnimatedLine;
