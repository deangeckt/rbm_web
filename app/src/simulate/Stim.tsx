import { Button, Grid, List, ListItem } from '@material-ui/core';
import React, { useContext } from 'react';
import { AppContext } from '../Contexts/AppContext';
import StimInput from './StimInput';
import { useSimulate } from './useSimulate';
import AddIcon from '@material-ui/icons/Add';

function Stim() {
    const { state } = useContext(AppContext);
    const { addStim } = useSimulate();

    return (
        <div style={{ border: '1px solid green' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    onClick={() => addStim()}
                    startIcon={<AddIcon />}
                >
                    Add
                </Button>
                <big style={{ color: 'black', display: 'block', fontSize: '14px', marginLeft: '14px' }}>
                    OR click on the tree
                </big>
            </div>

            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <List>
                        {state.stims
                            .filter((_stim, i) => i % 2 === 0)
                            .map((stim, i) => (
                                <ListItem key={i}>
                                    <StimInput key={i} idx={i} stim={stim} />
                                </ListItem>
                            ))}
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <List>
                        {state.stims
                            .filter((_stim, i) => i % 2 !== 0)
                            .map((stim, i) => (
                                <ListItem key={i}>
                                    <StimInput key={i} idx={i} stim={stim} />
                                </ListItem>
                            ))}
                    </List>
                </Grid>
            </Grid>
        </div>
    );
}

export default Stim;
