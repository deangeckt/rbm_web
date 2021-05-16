import React from 'react';
import { Spring, animated } from '@react-spring/konva';
import { Circle } from 'react-konva';
import { IAnimData } from '../../Wrapper';

export interface AnimatedCircleProps {
    animProps: IAnimData[];
    radius: number;
    x: number;
    y: number;
    start: boolean;
    durScale: number;
}

const AnimatedCircle = ({ animProps, start, radius, x, y, durScale }: AnimatedCircleProps) => {
    const advanceAnim = (idx: number) => {
        if (idx === animList.length) setAnim(renderNoneAnim());
        else setAnim(animList[idx]);
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

    const propsToSpeed = () => {
        const speeds = animProps.map((ap) => {
            return ap.dur;
        });
        return speeds;
    };

    const [animList, setAnimList] = React.useState(propsToAnims());
    const [speeds, setSpeed] = React.useState(propsToSpeed());
    const [anim, setAnim] = React.useState(animList[0]);

    React.useEffect(() => {
        if (!start) {
            setAnim(animList[0]);
        }
    }, [start]);

    React.useEffect(() => {
        animList.forEach((anim, i) => {
            anim.props.config.duration = durScale * speeds[i];
        });
    }, [durScale]);

    React.useEffect(() => {
        setAnimList(propsToAnims());
        setSpeed(propsToSpeed());
    }, [animProps]);

    return start ? anim : renderNoneAnim();
};
export default AnimatedCircle;
