import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { IconButton, Button } from '@material-ui/core';
import InfoIcon from '@mui/icons-material/Info';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IAttr, impKeys } from '../../Wrapper';
import { useDynamicForms } from './useDynamicForm';
import { useDialogs } from '../dialog/useDialogs';
import BruteMechParamDialog from '../dialog/BruteMechParamDialog';
import { AppContext } from '../../AppContext';

export interface IDynamicAttrProps {
    attrs: IAttr;
    attr_key: string;
    impKey: impKeys;
}

function DynamicAttrBrute({ attrs, impKey, attr_key }: IDynamicAttrProps) {
    const { state } = useContext(AppContext);
    const currAttr = state.bruteCurrAttr;
    const { setBruteKeyChecked, isBruteKeySelected } = useDynamicForms();
    const { toggleBrute, updateInfo } = useDialogs();

    const operationStr = impKey.startsWith('global') ? 'Change' : 'Add';
    const exclude = ['sim_time', 'dt'];
    const attrs_list = Object.entries(attrs).filter(([attr]) => !exclude.includes(attr));
    const checked = isBruteKeySelected(impKey);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px' }}>
            <BruteMechParamDialog attrKey={currAttr} impKey={impKey} />

            {attr_key === '' ? (
                <div>Select Mechanism</div>
            ) : (
                <>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={checked}
                                onChange={() => setBruteKeyChecked(impKey, !checked)}
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
                                        onClick={() => toggleBrute(true, attr)}
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
