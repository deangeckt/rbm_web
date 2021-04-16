import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Button } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { useDynamicForms } from './useDynamicForm';

export interface IKeyListProps {
    keys: string[];
}

function DynamicKeys({ keys }: IKeyListProps) {
    // const { updateDialogInfo } = useDialogs();
    const { setKeySelected } = useDynamicForms();

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
                                variant="contained"
                                color="primary"
                                onClick={() => setKeySelected(key)}
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
