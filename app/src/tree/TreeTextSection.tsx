import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useSimulate } from '../simulate/useSimulate';

export interface ITreeTextProps {
    section_key: string;
    depth: number;
}

function TreeTextSection({ section_key, depth }: ITreeTextProps) {
    // const { state } = useContext(AppContext);
    const { sectionKeyToLabel } = useSimulate();
    const margin = `${depth}ex`;

    return (
        <div
            key={section_key}
            style={{ display: 'flex', flexDirection: 'row', marginLeft: margin, borderLeft: '1px solid' }}
        >
            <FormControlLabel
                label={sectionKeyToLabel(section_key)}
                control={<Checkbox color="primary" checked={true} />}
                labelPlacement="end"
            />
        </div>
    );
}

export default TreeTextSection;
