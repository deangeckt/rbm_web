import React from 'react';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { useSectionForm } from './useSectionForm';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import './Form.css';

function SectionFormSegmentHeader() {
    const {
        getSectionSegment,
        updateSectionSegment,
        addSectionSegment,
        deleteSectionSegment,
        onlyOneSectionSegment,
        SectionSegmentNavigate,
    } = useSectionForm();
    return (
        <div className="SctionFormProcessHeader">
            <IconButton
                disabled={onlyOneSectionSegment()}
                color="primary"
                size="medium"
                onClick={() => SectionSegmentNavigate(false)}
            >
                <NavigateBeforeIcon />
            </IconButton>
            <TextField
                label={'Section'}
                variant="filled"
                type="number"
                value={getSectionSegment()}
                onChange={(e) => updateSectionSegment(Number(e.target.value))}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
            />
            <Tooltip title="Add segment">
                <IconButton color="primary" onClick={() => addSectionSegment()}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete section">
                <div style={{ display: 'flex' }}>
                    <IconButton
                        disabled={onlyOneSectionSegment()}
                        color="primary"
                        onClick={() => deleteSectionSegment()}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            </Tooltip>
            <IconButton
                disabled={onlyOneSectionSegment()}
                color="primary"
                size="medium"
                onClick={() => SectionSegmentNavigate(true)}
            >
                <NavigateNextIcon />
            </IconButton>
        </div>
    );
}

export default SectionFormSegmentHeader;
