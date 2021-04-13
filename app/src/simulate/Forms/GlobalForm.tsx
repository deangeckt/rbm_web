import React, { useContext } from 'react';
import GlobalInput from './GlobalInput';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import { AppContext } from '../../Contexts/AppContext';

function GlobalForm() {
    const { state } = useContext(AppContext);

    const g1 = state.inputs.filter((input) => input.group === 1);
    const g2 = state.inputs.filter((input) => input.group !== 1);
    return (
        <div style={{ border: '1px solid red' }}>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <List>
                        {g1.map((input, i) => (
                            <ListItem key={i}>
                                <GlobalInput key={i} input={input} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <List>
                        {g2.map((input, i) => (
                            <ListItem key={i}>
                                <GlobalInput key={i} input={input} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </div>
    );
}

export default GlobalForm;
