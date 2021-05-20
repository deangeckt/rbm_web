import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Button, IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { useDynamicForms } from './useDynamicForm';
import { impKeys } from '../../Wrapper';
import { useDialogs } from '../dialogs/useDialogs';

export interface IKeyListProps {
    keys: string[];
    selectedKey: string;
    impKey: impKeys;
}

function DynamicKeys({ keys, selectedKey, impKey }: IKeyListProps) {
    const { updateInfo } = useDialogs();
    const { setCurrKey } = useDynamicForms();

    return (
        <>
            <List>
                {keys.map((key) => (
                    <ListItem key={key}>
                        <div key={key} style={{ display: 'flex', flexDirection: 'row' }}>
                            <IconButton color="primary" size="small" onClick={() => updateInfo(key)}>
                                <InfoIcon />
                            </IconButton>
                            <Button
                                className="NoCapsButton"
                                variant={selectedKey === key ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => setCurrKey(impKey, key)}
                            >
                                {key}
                            </Button>
                        </div>
                    </ListItem>
                ))}
            </List>
        </>
    );
}

export default DynamicKeys;
