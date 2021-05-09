import React from 'react';
import { Spring, animated } from '@react-spring/konva';
import { lineRadiusAddition } from '../utils/swcUtils';
import { RenderILine } from '../Wrapper';
import { AnimProps } from './TreeCanvasAnimated';

export interface AnimatedLinedProps {
    line: RenderILine;
    animProps: AnimProps[];
}

const AnimatedLine = ({ line, animProps }: AnimatedLinedProps) => {
    const advanceAnim = (idx: number) => {
        const newIdx = idx === animProps.length ? 0 : idx;
        setAnim(renderNewAnim(line, newIdx));
    };

    const renderNewAnim = (line: RenderILine, idx: number) => {
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

    const [anim, setAnim] = React.useState(renderNewAnim(line, 0));

    return anim;
};
export default AnimatedLine;
