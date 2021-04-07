import { Button, List, ListItem } from '@material-ui/core';
import React, { useContext } from 'react';
import { AppContext } from '../Contexts/AppContext';
import StimInput from './StimInput';
import { useSimulate } from './useSimulate';
import AddIcon from '@material-ui/icons/Add';

function Stim() {
    const { state } = useContext(AppContext);
    const { addStim } = useSimulate();

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Button variant="outlined" color="primary" onClick={() => addStim()} startIcon={<AddIcon />}>
                        Add
                    </Button>
                    <big style={{ color: 'black', display: 'block', fontSize: '14px', marginLeft: '14px' }}>
                        OR click on the tree
                    </big>
                </div>

                <List>
                    {state.stims.map((stim, i) => (
                        <ListItem key={i} button>
                            <StimInput key={i} idx={i} stim={stim} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </>
    );
}

export default Stim;
