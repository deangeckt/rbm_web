import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Button } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { useDynamicForms } from './useDynamicForm';
import { impKeys } from '../../Wrapper';

export interface IKeyListProps {
    keys: string[];
    selectedKey: string;
    impKey: impKeys;
}

function DynamicKeys({ keys, selectedKey, impKey }: IKeyListProps) {
    // const { updateDialogInfo } = useDialogs();
    const { setCurrKey } = useDynamicForms();

    return (
        <>
            <List>
                {keys.map((key) => (
                    <ListItem key={key}>
                        <div key={key} style={{ display: 'flex', flexDirection: 'row' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                // onClick={() => updateDialogInfo(input.id)}
                                startIcon={<InfoIcon />}
                            ></Button>
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
