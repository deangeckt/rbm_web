import React from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import { ISection, section_types } from '../../Wrapper';

export interface ISectionInputProps {
    section: ISection;
    idx: number;
    update: Function;
}

function SectionInput({ section, idx, update }: ISectionInputProps) {
    return (
        <>
            <TextField
                select
                label="Type"
                variant="filled"
                value={section.type}
                onChange={(e) => update('type', Number(e.target.value), idx)}
            >
                {section_types.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label={'Id'}
                variant="filled"
                type="number"
                defaultValue={section.id}
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(e) => update('id', Number(e.target.value), idx)}
            />
            <TextField
                label={'Section'}
                variant="filled"
                type="number"
                defaultValue={section.section}
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(e) => update('section', Number(e.target.value), idx)}
            />
        </>
    );
}

export default SectionInput;
