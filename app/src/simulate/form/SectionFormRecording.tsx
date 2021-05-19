import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { section_recording } from '../../Wrapper';
import { useSectionForm } from './useSectionForm';

function SectionFormRecording() {
    const { getSectionRecording, updateSectionRecording } = useSectionForm();
    const records = getSectionRecording();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {section_recording.map((option, idx) => (
                <FormControlLabel
                    key={idx}
                    control={
                        <Checkbox
                            color="primary"
                            checked={records.indexOf(idx) !== -1}
                            onChange={() => updateSectionRecording(idx, records.indexOf(idx) === -1)}
                        />
                    }
                    label={option}
                />
            ))}
        </div>
    );
}

export default SectionFormRecording;
