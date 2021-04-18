import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useTreeText } from './useTreeText';

export interface ITreeTextProps {
    sectionKey: string;
    depth: number;
}

function TreeTextSection({ sectionKey, depth }: ITreeTextProps) {
    const { sectionKeyToLabel, isSectionSelected, setSectionChecked } = useTreeText();
    const [check, setCheck] = React.useState(false);

    const theme = useTheme();
    const margin = `${depth * 1.5}ex`;
    const border = `2px solid ${theme.palette.primary.main}`;
    const fontWeight = isSectionSelected(sectionKey) ? 600 : 500;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheck(event.target.checked);
        setSectionChecked(sectionKey);
    };

    return (
        <div key={sectionKey} style={{ marginLeft: margin, borderLeft: border }}>
            <FormControlLabel
                label={<Typography style={{ fontWeight: fontWeight }}>{sectionKeyToLabel(sectionKey)}</Typography>}
                control={<Checkbox color="primary" checked={check} onChange={handleChange} />}
                labelPlacement="start"
            />
        </div>
    );
}

export default TreeTextSection;
