import React from 'react';
import { Spring, animated } from '@react-spring/konva';
import { lineRadiusAddition } from '../utils/swcUtils';
import { RenderILine } from '../Wrapper';
import { AnimProps } from './TreeCanvasAnimated';

export interface AnimatedLinedProps {
    line: RenderILine;
    animList: AnimProps[];
}

const AnimatedLine = ({ line, animList }: AnimatedLinedProps) => {
    const advanceAnim = (idx: number) => {
        const newIdx = idx === animList.length ? 0 : idx;
        setAnim(renderNewAnim(line, newIdx));
    };

    const renderNewAnim = (line: RenderILine, idx: number) => {
        return (
            <Spring
                from={{ stroke: animList[idx].from }}
                to={{ stroke: animList[idx].to }}
                config={{ duration: animList[idx].dur }}
                onRest={() => advanceAnim(idx + 1)}
            >
                {(props) => (
                    <animated.Line
                        {...props}
                        points={[...line.points]}
                        strokeWidth={line.radius + lineRadiusAddition}
                        draggable={false}
                    />
                )}
            </Spring>
        );
    };

    const [anim, setAnim] = React.useState(renderNewAnim(line, 0));

    return anim;
};
export default AnimatedLine;
