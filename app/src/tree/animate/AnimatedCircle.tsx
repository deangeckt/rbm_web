import React from 'react';
import { Spring, animated } from '@react-spring/konva';
import { AnimProps } from './TreeCanvasAnimated';
import { Circle } from 'react-konva';

export interface AnimatedCircleProps {
    animProps: AnimProps[];
    radius: number;
    x: number;
    y: number;
    start: boolean;
}

const AnimatedCircle = ({ animProps, start, radius, x, y }: AnimatedCircleProps) => {
    const advanceAnim = (idx: number) => {
        const newIdx = idx === animList.length ? 0 : idx;
        setAnim(animList[newIdx]);
    };

    const renderNoneAnim = () => {
        return <Circle radius={radius} draggable={false} fill={animProps[0].from} x={x} y={y} />;
    };

    const renderNewAnim = (idx: number) => {
        return (
            <Spring
                from={{ fill: animProps[idx].from }}
                to={{ fill: animProps[idx].to }}
                config={{ duration: animProps[idx].dur }}
                onRest={() => advanceAnim(idx + 1)}
            >
                {(props) => (
                    <animated.Circle
                        {...props}
                        x={x}
                        y={y}
                        radius={radius}
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
export default AnimatedCircle;
