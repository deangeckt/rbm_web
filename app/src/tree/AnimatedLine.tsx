import React from 'react';
import { lineRadiusAddition } from '../utils/swcUtils';
import { RenderILine } from '../Wrapper';
import { useSpring, animated } from 'react-spring';
import { useSimulateCanvas } from './useSimulateCanvas';

interface AnimProps {
    from: string;
    to: string;
    dur: number;
    delay: number;
}

const animList: AnimProps[] = [
    {
        from: 'red',
        to: 'blue',
        dur: 2000,
        delay: 0,
    },
    {
        from: 'blue',
        to: 'green',
        dur: 2000,
        delay: 2000,
    },
    {
        from: 'green',
        to: 'yellow',
        dur: 2000,
        delay: 4000,
    },
];

const AnimatedLine = () => {
    const { getLinesArrayNoRoot } = useSimulateCanvas();

    const createAnim = (idx: number) => {
        if (idx > animList.length - 1) return;
        const props = useSpring({
            config: { duration: animList[idx].dur },
            to: { stroke: animList[idx].to },
            from: { stroke: animList[idx].from },
            delay: animList[idx].delay,
            onRest: () => advanceAnim(idx + 1),
        });
        return props;
    };

    const animProps = animList.map((_p, i) => {
        return createAnim(i);
    });
    const [anim, setAnim] = React.useState(animProps[0]);

    const advanceAnim = (idx: number) => {
        const newIdx = idx === animProps.length ? 0 : idx;
        setAnim(animProps[newIdx]);
    };

    return (
        <animated.svg style={{ width: '100%', height: '100%', ...anim }} fill="none" strokeDasharray={156}>
            {getLinesArrayNoRoot().map((l: RenderILine) => {
                return (
                    <polyline
                        key={l.id}
                        points={l.points.toString()}
                        style={{ strokeWidth: l.radius + lineRadiusAddition }}
                    />
                );
            })}
        </animated.svg>
    );
};

export default AnimatedLine;
