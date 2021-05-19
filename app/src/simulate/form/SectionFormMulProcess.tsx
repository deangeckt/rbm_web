import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { useSectionForm } from './useSectionForm';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import './Form.css';

function SectionFormMulProcess() {
    const { addProcess, deleteProcess, onlyOneProcess, processNaviagte, disableProcessAdd } = useSectionForm();
    return (
        <div className="SctionFormProcessHeader">
            <IconButton
                disabled={onlyOneProcess()}
                color="primary"
                size="medium"
                onClick={() => processNaviagte(false)}
            >
                <NavigateBeforeIcon />
            </IconButton>
            <Tooltip title="Add another process for this segment">
                <div style={{ display: 'flex' }}>
                    <IconButton disabled={disableProcessAdd()} color="primary" onClick={() => addProcess()}>
                        <AddIcon />
                    </IconButton>
                </div>
            </Tooltip>
            <Tooltip title="Delete process">
                <div style={{ display: 'flex' }}>
                    <IconButton disabled={onlyOneProcess()} color="primary" onClick={() => deleteProcess()}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </Tooltip>
            <IconButton disabled={onlyOneProcess()} color="primary" size="medium" onClick={() => processNaviagte(true)}>
                <NavigateNextIcon />
            </IconButton>
        </div>
    );
}

export default SectionFormMulProcess;
