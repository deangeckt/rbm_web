import { Button, TextField } from '@material-ui/core';
import React from 'react';
import FreeHandCanvas, { x_pixel_to_grid, y_pixel_to_grid } from './FreeHandCanvas';
import { Autocomplete } from '@material-ui/lab';
import { useTreeText } from '../../tree/useTreeText';
import { root_key } from '../../Wrapper';
import { sectionKeyToLabel } from '../../util/generalUtils';
import './FreeHand.css';

export interface simpleLine {
    points: number[];
}
const init_lines: simpleLine[] = [];

type SearchedSection = string | undefined;
const noSearch: SearchedSection = undefined;

interface SearchedSectionLabel {
    label: string;
    key: string;
}
const searchOptions_init: SearchedSectionLabel[] = [];

export interface IFreeHandPlotProps {
    display: boolean;
}

function FreeHandPlot({ display }: IFreeHandPlotProps) {
    const [lines, setLines] = React.useState(init_lines);
    const [maxy, setMaxy] = React.useState(70);
    const [miny, setMiny] = React.useState(-70);
    const [time, setTime] = React.useState(100);
    const [sectionKey, setSectionKey] = React.useState(noSearch);
    const [segment, setSegment] = React.useState(0.5);
    const [options, setOptions] = React.useState(searchOptions_init);
    const { getTreeChildrenRecur } = useTreeText();

    React.useEffect(() => {
        const all: string[] = [root_key];
        getTreeChildrenRecur(root_key, all);
        setOptions(
            all.map((sec_key) => {
                return { label: sectionKeyToLabel(sec_key), key: sec_key };
            }),
        );
    }, []);

    const handToVector = () => {
        const xVec: number[] = [];
        const yVec: number[] = [];
        const line = lines[lines.length - 1];
        if (!line) return;
        line.points.forEach((point, idx) => {
            if (idx % 2 === 0) xVec.push(x_pixel_to_grid(point, time));
            else yVec.push(y_pixel_to_grid(point, maxy, miny));
        });
        console.log(yVec);
    };

    const validOneLine = (): boolean => {
        return lines.length === 1 && sectionKey !== noSearch;
    };

    return (
        <div style={{ height: '100%', width: '100%', display: display ? 'flex' : 'none', flexDirection: 'column' }}>
            <div className="FreeHandPanel">
                <div style={{ display: 'flex' }}>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option.label}
                        getOptionSelected={(option, value) => option.key === value.key}
                        onChange={(_event, value) => setSectionKey(value?.key ?? undefined)}
                        style={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} label="Section" variant="outlined" />}
                    />
                    <TextField
                        style={{ width: 100 }}
                        value={segment}
                        onChange={(e) => setSegment(Number(e.target.value))}
                        label="Segment"
                        variant="outlined"
                        type="number"
                        InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }}
                    />
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
