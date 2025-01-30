import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { useSectionForm } from './useSectionForm';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
