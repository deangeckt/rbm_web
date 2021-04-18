import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useSimulate } from '../simulate/useSimulate';
import { useTheme } from '@material-ui/core/styles';

export interface ITreeTextProps {
    section_key: string;
    depth: number;
}

function TreeTextSection({ section_key, depth }: ITreeTextProps) {
    // const { state } = useContext(AppContext);
    const { sectionKeyToLabel } = useSimulate();
    const theme = useTheme();
    const margin = `${depth * 1.5}ex`;
    const border = `2px solid ${theme.palette.primary.main}`;

    return (
        <div key={section_key} style={{ marginLeft: margin, borderLeft: border }}>
            <FormControlLabel
                label={sectionKeyToLabel(section_key)}
                control={<Checkbox color="primary" checked={true} />}
                labelPlacement="start"
            />
        </div>
    );
}

export default TreeTextSection;
