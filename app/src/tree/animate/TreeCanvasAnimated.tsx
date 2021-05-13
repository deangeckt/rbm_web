import React, { useContext } from 'react';
import { Stage, Layer } from 'react-konva';
import { RenderILine, root_id } from '../../Wrapper';
import AnimatedLine from './AnimatedLine';
import { useSimulateCanvas } from '../useSimulateCanvas';
import { useTreeCanvasCommon } from '../useTreeCanvasCommon';
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import { AppContext } from '../../AppContext';
import AnimatedCircle from './AnimatedCircle';
import './Animate.css';
import { neuronRadToSize } from '../../utils/swcUtils';

export interface AnimProps {
    from: string;
    to: string;
    dur: number;
}

const animList: AnimProps[] = [
    {
        from: '#FF0000',
        to: '#0000FF',
        dur: 1500,
    },
    {
        from: '#0000FF',
        to: '#00FF00',
        dur: 1500,
    },
    {
        from: '#00FF00',
        to: '#FF0000',
        dur: 1500,
    },
];

export interface ITreeCanvasAnimatedProps {
    display: boolean;
}

const TreeCanvasAnimated = ({ display }: ITreeCanvasAnimatedProps) => {
    const { state, setState } = useContext(AppContext);
    const { handleWheel } = useTreeCanvasCommon();
    const { getLinesArrayNoRoot } = useSimulateCanvas();

    const [stageScale, setStageScale] = React.useState(1);
    const [stageCoord, setStageCoord] = React.useState({ x: 0, y: 0 });
    const [startAnim, setStartAnim] = React.useState(false);

    const randomAnimPropsPerLine: Record<string, AnimProps[]> = {};
    const lines = getLinesArrayNoRoot();
    for (let i = 0; i < lines.length; i++) {
        const ap = animList.map((a) => ({ ...a }));
        randomAnimPropsPerLine[lines[i].id] = ap;
    }

    return (
        <div style={{ display: display ? undefined : 'none', width: '100%', height: '100%' }}>
            {!state.addAnims ? (
                <div className="AnimateTextHeader">
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={state.addAnims}
                                onClick={() => {
                                    setState({ ...state, addAnims: !state.addAnims });
                                }}
                            />
                        }
                        label={'Include animations'}
                        labelPlacement="start"
                    />
                    <div>This will increase run time. to turn off use the menu</div>
                </div>
            ) : (
                <>
                    <div className="AnimatePanel">
                        <Button
                            className="NoCapsButton"
                            variant={'outlined'}
                            color="primary"
                            onClick={() => setStartAnim(!startAnim)}
                        >
                            {startAnim ? 'Stop' : 'Play'}
                        </Button>
                    </div>
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
                            <AnimatedCircle
                                radius={neuronRadToSize(state.designLines[root_id].radius)}
                                start={startAnim}
                                animProps={animList}
                                x={state.stage.rootX}
                                y={state.stage.rootY}
                            />
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
                </>
            )}
        </div>
    );
};

export default TreeCanvasAnimated;
