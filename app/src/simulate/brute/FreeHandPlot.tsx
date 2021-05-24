import { Button, TextField } from '@material-ui/core';
import React, { useContext } from 'react';
import FreeHandCanvas from './FreeHandCanvas';
import './FreeHand.css';
import { IPlotPayload } from '../../Wrapper';
import { AppContext } from '../../AppContext';

export interface FreeLine {
    points: number[];
}

const init_lines: FreeLine[] = [];
const canvasSize = 500;

export interface IFreeHandPlotProps {
    display: boolean;
}

function FreeHandPlot({ display }: IFreeHandPlotProps) {
    const [lines, setLines] = React.useState(init_lines);
    const [maxy, setMaxy] = React.useState(70);
    const [miny, setMiny] = React.useState(-70);
    const [time, setTime] = React.useState(100);
    const { state, setState } = useContext(AppContext);

    const handToVector = () => {
        const xVec: number[] = [];
        const yVec: number[] = [];
        const yLen = maxy + Math.abs(miny);

        const line = lines[lines.length - 1];
        if (!line) return;
        line.points.forEach((point, idx) => {
            if (idx % 2 === 0) {
                xVec.push((point * time) / canvasSize);
            } else {
                const scaled = (point * yLen) / canvasSize;
                yVec.push(maxy - scaled);
            }
        });
        // tset
        const volt: Record<string, number[]> = {};
        volt['0_1_0_0.5'] = yVec;
        const payload: IPlotPayload = {
            time: xVec,
            volt: volt,
            current: {},
        };

        const plots = [...state.plots];
        plots.push(payload);
        setState({ ...state, plots: plots });
    };

    const validOneLine = (): boolean => {
        return lines.length === 1;
    };

    return (
        <div style={{ height: '100%', width: '100%', display: display ? 'flex' : 'none', flexDirection: 'column' }}>
            <div className="FreeHandPanel">
                <Button
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    onClick={() => setLines(init_lines)}
                >
                    Clear
                </Button>
                <Button
                    disabled={!validOneLine()}
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    onClick={() => handToVector()}
                >
                    Next
                </Button>
            </div>
            <div className="FreeHandSketch">
                <div className="FreeHandSketchRow">
                    <div className="FreeHandYAxis">
                        <TextField
                            label={'Max voltage [mV]'}
                            variant="filled"
                            type="number"
                            value={maxy}
                            onChange={(e) => setMaxy(Number(e.target.value))}
                        />
                        <TextField
                            label={'Min voltage [mV]'}
                            variant="filled"
                            type="number"
                            value={miny}
                            onChange={(e) => setMiny(Number(e.target.value))}
                        />
                    </div>
                    <div className="FreeHandCanvas">
                        <FreeHandCanvas lines={lines} setLines={setLines} />
                    </div>
                </div>
                <div className="FreeHandXAxis">
                    <TextField
                        label={'Time [mS]'}
                        variant="filled"
                        type="number"
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
}

export default FreeHandPlot;
