import { Button, TextField } from '@material-ui/core';
import React from 'react';
import FreeHandCanvas from './FreeHandCanvas';
import { Autocomplete } from '@material-ui/lab';
import { useTreeText } from '../../tree/useTreeText';
import { root_key } from '../../Wrapper';
import { sectionKeyToLabel } from '../../utils/generalUtils';
import './FreeHand.css';

export interface FreeLine {
    points: number[];
}

const init_lines: FreeLine[] = [];
const canvasSize = 500;

export interface IFreeHandPlotProps {
    display: boolean;
}

type SearchedSection = string | undefined;
const noSearch: SearchedSection = undefined;

function FreeHandPlot({ display }: IFreeHandPlotProps) {
    const [lines, setLines] = React.useState(init_lines);
    const [maxy, setMaxy] = React.useState(70);
    const [miny, setMiny] = React.useState(-70);
    const [time, setTime] = React.useState(100);
    const [sectionKey, setSectionKey] = React.useState(noSearch);

    const { getTreeChildrenRecur } = useTreeText();
    const all: string[] = [root_key];

    React.useEffect(() => {
        getTreeChildrenRecur(root_key, all);
    }, []);

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
    };

    const validOneLine = (): boolean => {
        return lines.length === 1 && sectionKey !== noSearch;
    };

    return (
        <div style={{ height: '100%', width: '100%', display: display ? 'flex' : 'none', flexDirection: 'column' }}>
            <div className="FreeHandPanel">
                <div>
                    <Autocomplete
                        options={all.map((sec_key) => {
                            return { label: sectionKeyToLabel(sec_key), key: sec_key };
                        })}
                        getOptionLabel={(option) => option.label}
                        getOptionSelected={(option, value) => option.key === value.key}
                        onChange={(_event, value) => setSectionKey(value?.key ?? undefined)}
                        style={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} label="Section" variant="outlined" />}
                    />
                    <TextField style={{ width: 100 }} label="Segment" variant="outlined" type="number" />
                </div>
                <div>
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
