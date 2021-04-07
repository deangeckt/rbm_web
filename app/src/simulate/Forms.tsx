import React, { useContext } from 'react';
import FormInput from './FormInput';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import { AppContext } from '../Contexts/AppContext';

export interface IFormsProps {
    updateDialog: (id: string) => void;
}

function Forms({ updateDialog }: IFormsProps) {
    const { state } = useContext(AppContext);

    const g1 = state.inputs.filter((input) => input.group === 1);
    const g2 = state.inputs.filter((input) => input.group !== 1);
    return (
        <div>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <List>
                        {g1.map((input, i) => (
                            <ListItem key={i} button>
                                <FormInput key={i} input={input} updateDialog={updateDialog} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <List>
                        {g2.map((input, i) => (
                            <ListItem key={i} button>
                                <FormInput key={i} input={input} updateDialog={updateDialog} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </div>
    );
}

export default Forms;
