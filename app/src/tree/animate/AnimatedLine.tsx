import React from 'react';
import { Spring, animated } from '@react-spring/konva';
import { lineRadiusAddition } from '../../utils/swcUtils';
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
                config={{ duration: animProps[idx].dur * durScale }}
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

    React.useEffect(() => {
        if (!start) {
            setAnim(animList[0]);
        }
    }, [start]);

    React.useEffect(() => {
        console.log('change to speed:', durScale);
        animList.forEach((anim) => {
            anim.props.config.duration *= durScale;
        });
    }, [durScale]);

    return start ? anim : renderNoneAnim();
};
export default AnimatedLine;
