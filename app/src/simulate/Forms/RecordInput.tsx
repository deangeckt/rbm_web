import React from 'react';
import { Button, MenuItem, TextField } from '@material-ui/core';
import { IRecordInput, recording_types } from '../../Wrapper';
import { useSimulate } from '../useSimulate';
import DeleteIcon from '@material-ui/icons/Delete';
import SectionInput from './SectionInput';

export interface IRecordInputProps {
    record: IRecordInput;
    idx: number;
}

function RecordInput({ record, idx }: IRecordInputProps) {
    const { updateRecordSimple, updateRecordSection, deleteRecord } = useSimulate();

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <SectionInput section={record.section} idx={idx} update={updateRecordSection} />
                <TextField
                    select
                    label="Type"
                    variant="filled"
                    value={record.type}
                    onChange={(e) => updateRecordSimple('type', e.target.value, idx)}
                >
                    {recording_types.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteRecord(idx)}
                >
                    Delete
                </Button>
            </div>
        </>
    );
}

export default RecordInput;
