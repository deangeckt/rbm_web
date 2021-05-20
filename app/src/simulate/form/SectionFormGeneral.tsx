import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { TextField, IconButton } from '@material-ui/core';
import { useSectionForm } from './useSectionForm';
import InfoIcon from '@material-ui/icons/Info';
import { useDialogs } from '../dialogs/useDialogs';

function SectionFormGeneral() {
    const { onChangeGeneralAttr, getSectionGenenralAttr } = useSectionForm();
    const attrs_list = Object.entries(getSectionGenenralAttr());
    const { updateInfo } = useDialogs();

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <List>
                {attrs_list.map(([attr, value]) => (
                    <ListItem key={attr}>
                        <div key={attr} style={{ display: 'flex', flexDirection: 'row' }}>
                            <IconButton color="primary" size="small" onClick={() => updateInfo(attr)}>
                                <InfoIcon />
                            </IconButton>
                            <TextField
                                label={attr}
                                variant="filled"
                                type="number"
                                value={value}
                                onChange={(e: any) => onChangeGeneralAttr(attr, Number(e.target.value))}
                            />
                        </div>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default SectionFormGeneral;
