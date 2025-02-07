import React from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete';
import { useTreeText } from '../../tree/useTreeText';
import { root_key } from '../../Wrapper';
import { sectionKeyToLabel } from '../../util/generalUtils';
import { useBruteForcePlot } from './useBruteForcePlot';
import NavButton from '../../util/NavButton';
import { BruteTab } from './BruteForcePlot';
import './bruteForcePlot.css';

interface SearchedSectionLabel {
    label: string;
    key: string;
}
const searchOptions_init: SearchedSectionLabel[] = [];

export interface IBruteForcePlotPanelProps {
    tab: BruteTab;
    setTab: (tab: BruteTab) => void;
}

function BruteForcePlotPanel({ tab, setTab }: IBruteForcePlotPanelProps) {
    const [options, setOptions] = React.useState(searchOptions_init);
    const { getTreeChildrenRecur } = useTreeText();
    const { getSegment, setSegment, setSection } = useBruteForcePlot();

    React.useEffect(() => {
        const all: string[] = [root_key];
        getTreeChildrenRecur(root_key, all);
        setOptions(
            all.map((sec_key) => {
                return { label: sectionKeyToLabel(sec_key), key: sec_key };
            }),
        );
    }, []);

    return (
        <div className="BruteForcePlotPanelMain">
            <div className="BruteForcePanelTextFields">
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => option.label}
                    // getOptionSelected={(option, value) => option.key === value.key}
                    onChange={(_event, value) => setSection(value?.key ?? undefined)}
                    style={{ width: 200 }}
                    renderInput={(params) => <TextField {...params} label="Section" variant="outlined" />}
                />
                <TextField
                    style={{ width: 100 }}
                    value={getSegment()}
                    onChange={(e) => setSegment(Number(e.target.value))}
                    label="Segment"
                    variant="outlined"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }}
                />
            </div>
            <div>
                <NavButton label={'Draw'} isSelected={tab === 'draw'} select={() => setTab('draw')} />
                <NavButton label={'Import'} isSelected={tab === 'import'} select={() => setTab('import')} />
            </div>
        </div>
    );
}

export default BruteForcePlotPanel;
