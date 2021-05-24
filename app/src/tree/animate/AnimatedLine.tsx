import React from 'react';
import { Spring, animated } from '@react-spring/konva';
import { lineRadiusAddition } from '../../util/swcUtils';
import { RenderILine, IAnimData } from '../../Wrapper';
import { Line } from 'react-konva';

export interface AnimatedLinedProps {
    line: RenderILine;
    animProps: IAnimData[];
    start: boolean;
    durScale: number;
}

const AnimatedLine = ({ line, animProps, start, durScale }: AnimatedLinedProps) => {
    const advanceAnim = (idx: number) => {
        if (idx === animList.length) setAnim(renderNoneAnim());
        else setAnim(animList[idx]);
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
export default AnimatedLine;
