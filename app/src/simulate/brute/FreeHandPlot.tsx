import React from 'react';
import { Button, TextField } from '@material-ui/core';
import FreeHandCanvas from './FreeHandCanvas';
import { useFreeHandPlot } from './useFreeHandPlot';
import './FreeHand.css';

export interface simpleLine {
    points: number[];
}
const init_lines: simpleLine[] = [];

function FreeHandPlot() {
    const { getTime, setTime, clearPlot, setPlot } = useFreeHandPlot();

    const [lines, setLines] = React.useState(init_lines);
    const [maxy, setMaxy] = React.useState(70);
    const [miny, setMiny] = React.useState(-70);
    const time = getTime();

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="FreeHandSketch">
                <Button
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        setLines(init_lines);
                        clearPlot();
                    }}
                >
                    Clear draw
                </Button>
                <div className="FreeHandSketchRow">
                    <div className="FreeHandYAxis">
                        <TextField
                            label={'Max voltage [mV]'}
                            variant="filled"
                            type="number"
                            value={maxy}
                            onChange={(e) => {
                                setMaxy(Number(e.target.value));
                                setPlot(lines, maxy, miny);
                            }}
                        />
                        <TextField
                            label={'Min voltage [mV]'}
                            variant="filled"
                            type="number"
                            value={miny}
                            onChange={(e) => {
                                setMiny(Number(e.target.value));
                                setPlot(lines, maxy, miny);
                            }}
                        />
                    </div>
                    <div>
                        <FreeHandCanvas lines={lines} setLines={setLines} time={time} maxy={maxy} miny={miny} />
                    </div>
                </div>
                <div className="FreeHandXAxis">
                    <TextField
                        label={'Time [mS]'}
                        variant="filled"
                        type="number"
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        InputProps={{ inputProps: { min: 0, max: 9999, step: 10 } }}
                    />
                </div>
            </div>
        </div>
    );
}

export default FreeHandPlot;
