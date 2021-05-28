import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { IconButton, Button } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IAttr, impKeys } from '../../Wrapper';
import { useDynamicForms } from './useDynamicForm';
import { useDialogs } from '../dialog/useDialogs';
import BruteParamDialog from '../dialog/BruteParamDialog';

export interface IDynamicAttrProps {
    attrs: IAttr;
    attr_key: string;
    checked: boolean;
    impKey: impKeys;
}

function DynamicAttrBrute({ attrs, impKey, attr_key, checked }: IDynamicAttrProps) {
    const [currAttr, setCurrAttr] = React.useState('');
    const { updateInfo } = useDialogs();
    // TODO: new key checked funcs based on new wrapper structures
    const { setKeyChecked, onAttrChange } = useDynamicForms();
    const { toggleBrute } = useDialogs();

    const operationStr = impKey.startsWith('global') ? 'Change' : 'Add';
    const exclude = ['sim_time', 'dt'];
    const attrs_list = Object.entries(attrs).filter(([attr]) => !exclude.includes(attr));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px' }}>
            <BruteParamDialog attrKey={currAttr} />

            {attr_key === '' ? (
                <div>Select Mechanism</div>
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
                                    <IconButton color="primary" size="small" onClick={() => updateInfo(attr)}>
                                        <InfoIcon />
                                    </IconButton>
                                    <Button
                                        disabled={!checked}
                                        className="NoCapsButton"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            toggleBrute(true);
                                            setCurrAttr(attr);
                                        }}
                                    >
                                        {`${attr}: ${value}`}
                                    </Button>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </div>
    );
}

export default DynamicAttrBrute;
