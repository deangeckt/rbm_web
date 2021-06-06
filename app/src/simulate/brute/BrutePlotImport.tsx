import React from 'react';
import { Button } from '@material-ui/core';
import { useBruteForcePlot } from './useBruteForcePlot';
import './bruteForcePlot.css';

function BrutePlotImport() {
    const { setPlot } = useBruteForcePlot();
    const [uploaded, setUploaded] = React.useState(false);

    const uploadBrutePlot = async (e: any) => {
        if (e?.target?.files?.length === 0) return;
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e?.target?.result;
            if (text) {
                setUploaded(true);
                console.log(text);
            }
        };
        reader.readAsText(e?.target?.files[0]);
    };

    return (
        <div className="BruteFoceImportMain">
            <Button className="Button" variant="outlined" color="primary" component="label">
                Import
                <input type="file" accept={'.json'} hidden onChange={(e) => uploadBrutePlot(e)} />
            </Button>
            {!uploaded && <div>We support json files in the format given when exporting a plot via the menu</div>}
        </div>
    );
}

export default BrutePlotImport;
