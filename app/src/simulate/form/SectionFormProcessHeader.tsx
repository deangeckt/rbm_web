import React from 'react';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { useSectionForm } from './useSectionForm';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

export interface ISectionFormProcessHeaderProps {
    label: string;
    isSelected: boolean;
    select: Function;
}

function SectionFormProcessHeader() {
    const {
        getSectionValue,
        updateSectionValue,
        addProcess,
        deleteProcess,
        onlyOneProcess,
        processNavigate,
    } = useSectionForm();
    return (
        <>
            <IconButton
                disabled={onlyOneProcess()}
                color="primary"
                size="medium"
                onClick={() => processNavigate(false)}
            >
                <NavigateBeforeIcon />
            </IconButton>
            <TextField
                label={'Section'}
                variant="filled"
                type="number"
                value={getSectionValue()}
                onChange={(e) => updateSectionValue(Number(e.target.value))}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
            />
            <Tooltip title="Add section">
                <IconButton color="primary" onClick={() => addProcess()}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete section">
                <div style={{ display: 'flex' }}>
                    <IconButton disabled={onlyOneProcess()} color="primary" onClick={() => deleteProcess()}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </Tooltip>
            <IconButton disabled={onlyOneProcess()} color="primary" size="medium" onClick={() => processNavigate(true)}>
                <NavigateNextIcon />
            </IconButton>
        </>
    );
}

export default SectionFormProcessHeader;
