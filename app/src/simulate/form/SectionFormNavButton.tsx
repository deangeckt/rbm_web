import React from 'react';
import Chip from '@material-ui/core/Chip';

export interface ISectionFormProcessHeaderProps {
    label: string;
    isSelected: boolean;
    select: Function;
}

function SectionFormNavButton({ label, isSelected, select }: ISectionFormProcessHeaderProps) {
    return (
        <Chip
            label={label}
            clickable
            color="primary"
            variant={isSelected ? 'default' : 'outlined'}
            onClick={() => select()}
        />
    );
}

export default SectionFormNavButton;
