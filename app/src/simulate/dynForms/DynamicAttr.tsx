import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Button, TextField } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IAttr, impKeys } from '../../Wrapper';
import { useDynamicForms } from './useDynamicForm';

export interface IDynamicAttrProps {
    attrs: IAttr[];
    attr_key: string;
    checked: boolean;
    impKey: impKeys;
}

function DynamicAttr({ attrs, impKey, attr_key, checked }: IDynamicAttrProps) {
    // const { updateDialogInfo } = useDialogs();
    // const { state } = useContext(AppContext);
    const { setKeyChecked, onChangeGlobalMech } = useDynamicForms();

    const headLine = impKey.endsWith('Mechanism') ? 'Mechanism' : 'Process';
    const operationStr = impKey.startsWith('global') ? 'Change' : 'Add';

    const onChange = (attr: string, value: number) => {
        if (impKey === 'globalMechanism') {
            onChangeGlobalMech(attr_key, attr, value);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {attrs.length === 0 ? (
                <div>Select {headLine}</div>
            ) : (
                <>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={checked}
                                onChange={() => setKeyChecked(impKey, attr_key, !checked)}
                            />
                        }
                        label={`${operationStr} ${attr_key}`}
                    />
                    <List>
                        {attrs.map((at) => (
                            <ListItem key={at.attr}>
                                <div key={at.attr} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        // onClick={() => updateDialogInfo(input.id)}
                                        startIcon={<InfoIcon />}
                                    ></Button>
                                    <TextField
                                        disabled={!checked}
                                        label={at.attr}
                                        variant="filled"
                                        type="number"
                                        defaultValue={at.value}
                                        onChange={(e: any) => onChange(at.attr, Number(e.target.value))}
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