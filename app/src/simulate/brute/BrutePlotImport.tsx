import React from 'react';
import { Button, Divider, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { useBruteForcePlot } from './useBruteForcePlot';
import { IPlotPayload } from '../../Wrapper';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { usePlots } from '../plot/usePlot';
import './bruteForcePlot.css';

const emptyPayloadList: IPlotPayload[] = [];
const emptyPayload: IPlotPayload = {
    time: [],
    volt: {},
    current: {},
};

function BrutePlotImport() {
    const { setPlot } = useBruteForcePlot();
    const { getPlotOptions, parsePlotName } = usePlots();

    const [payloadList, setPayloadList] = React.useState(emptyPayloadList);
    const [currPayload, setCurrPayload] = React.useState(emptyPayload);

    const uploadBrutePlot = async (e: any) => {
        if (e?.target?.files?.length === 0) return;
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e?.target?.result;
            if (text) {
                const payload = JSON.parse(text as string) as IPlotPayload[];
                setPayloadList(payload);
            }
        };
        reader.readAsText(e?.target?.files[0]);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const key = (event.target as HTMLInputElement).value;
        const idx = key.split('_')[0];
        const payload = payloadList[Number(idx)];
        const record_key = key.substring(2, key.length);
        setCurrPayload(payload);
        setPlot(payload.volt[record_key]);
    };

    return (
        <div className="BruteFoceImport">
            <div className="BruteFoceImportPanel">
                <Button className="Button" variant="outlined" color="primary" component="label">
                    Import
                    <input type="file" accept={'.json'} hidden onChange={(e) => uploadBrutePlot(e)} />
                </Button>
                {payloadList.length === 0 ? (
                    <div>We support json files in the format given when exporting a plot via the menu</div>
                ) : (
                    <div className="BruteFoceImportMiddle">
                        <div className="BruteFoceImportList">
                            <RadioGroup onChange={handleChange}>
                                {payloadList.map((payload, i) => {
                                    return (
                                        <div key={i} className="BruteFoceImportListItem">
                                            {Object.keys(payload.volt).map((key) => (
                                                <FormControlLabel
                                                    key={`${i}_${key}`}
                                                    value={`${i}_${key}`}
                                                    control={<Radio />}
                                                    label={parsePlotName(key)}
                                                />
                                            ))}
                                            <Divider />
                                        </div>
                                    );
                                })}
                            </RadioGroup>
                        </div>
                        <div className="BruteFoceImportPlot">
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={getPlotOptions(currPayload.volt, currPayload.time, 'Voltage [mV]')}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BrutePlotImport;