import React, { useContext } from 'react';
import { Stage, Layer } from 'react-konva';
import { RenderILine, root_id, root_key } from '../../Wrapper';
import AnimatedLine from './AnimatedLine';
import { useSimulateCanvas } from '../useSimulateCanvas';
import { useTreeCanvasCommon } from '../useTreeCanvasCommon';
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import { AppContext } from '../../AppContext';
import AnimatedCircle from './AnimatedCircle';
import { neuronRadToSize } from '../../utils/swcUtils';
import './Animate.css';

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
    const lines = getLinesArrayNoRoot();
    const anims = { ...state.animations };

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
                            {anims[root_key] && (
                                <AnimatedCircle
                                    radius={neuronRadToSize(state.designLines[root_id].radius)}
                                    start={startAnim}
                                    animProps={anims[root_key]}
                                    x={state.stage.rootX}
                                    y={state.stage.rootY}
                                />
                            )}
                            {lines.map((l: RenderILine) => {
                                return (
                                    anims[l.id] && (
                                        <AnimatedLine key={l.id} line={l} animProps={anims[l.id]} start={startAnim} />
                                    )
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
