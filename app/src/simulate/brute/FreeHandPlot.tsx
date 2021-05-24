import { Button } from '@material-ui/core';
import React from 'react';
import FreeHandCanvas from './FreeHandCanvas';
import './FreeHand.css';

export interface FreeLine {
    points: number[];
}

const init_lines: FreeLine[] = [];

function FreeHandPlot() {
    const [lines, setLines] = React.useState(init_lines);

    return (
        <div className="FreeHandMain">
            <div className="FreeHandPanel">
                <Button
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    onClick={() => setLines(init_lines)}
                >
                    Clear
                </Button>
                <Button className="NoCapsButton" variant="outlined" color="primary">
                    Next
                </Button>
            </div>
            <div className="FreeHandCanvas">
                <div className="FreeHandCanvasRow">
                    <div className="FreeHandYAxis">YAxis</div>
                    <FreeHandCanvas lines={lines} setLines={setLines} />
                </div>
                <div className="FreeHandXAxis">XAxis</div>
            </div>
        </div>
    );
}

export default FreeHandPlot;
