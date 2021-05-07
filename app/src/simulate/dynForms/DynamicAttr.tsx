import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { TextField, IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IAttr, impKeys } from '../../Wrapper';
import { useDynamicForms } from './useDynamicForm';
import { useDialogs } from '../dialogs/useDialogs';

export interface IDynamicAttrProps {
    attrs: IAttr;
    attr_key: string;
    checked: boolean;
    impKey: impKeys;
}

function DynamicAttr({ attrs, impKey, attr_key, checked }: IDynamicAttrProps) {
    const { updateKeyInfo } = useDialogs();
    const { setKeyChecked, onAttrChange } = useDynamicForms();

    const headLine = impKey.endsWith('Mechanism') ? 'Mechanism' : 'Process';
    const operationStr = impKey.startsWith('global') ? 'Change' : 'Add';
    const attrs_list = Object.entries(attrs);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px' }}>
            {attrs_list.length === 0 ? (
                <div>Select {headLine}</div>
            ) : (
                <>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={checked}
                                onChange={() => setKeyChecked(impKey, !checked)}
                            />
                        }
                        label={`${operationStr} ${attr_key}`}
                    />
                    <List>
                        {attrs_list.map(([attr, value]) => (
                            <ListItem key={attr}>
                                <div key={attr} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <IconButton color="primary" size="small" onClick={() => updateKeyInfo(attr)}>
                                        <InfoIcon />
                                    </IconButton>
                                    <TextField
                                        disabled={!checked}
                                        label={attr}
                                        variant="filled"
                                        type="number"
                                        value={value}
                                        onChange={(e: any) => onAttrChange(impKey, attr, Number(e.target.value))}
                                    />
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </div>
    );
}

export default DynamicAttr;
