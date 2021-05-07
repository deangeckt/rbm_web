import React from 'react';

import { TextField, MenuItem } from '@material-ui/core';
import { section_recording } from '../../Wrapper';
import { useSectionForm } from './useSectionForm';

function SectionFormRecording() {
    const { getSectionRecording, updateSectionRecording } = useSectionForm();

    return (
        <TextField
            style={{ width: '100%' }}
            select
            label="Recording"
            variant="filled"
            value={getSectionRecording()}
            onChange={(e) => updateSectionRecording(Number(e.target.value))}
        >
            {section_recording.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default SectionFormRecording;
