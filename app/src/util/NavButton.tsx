import React from 'react';
import Chip from '@material-ui/core/Chip';

export interface INavButtonProps {
    label: string;
    isSelected: boolean;
    select: Function;
}

function NavButton({ label, isSelected, select }: INavButtonProps) {
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

export default NavButton;
