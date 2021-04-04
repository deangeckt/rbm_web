import './Forms.css';
import React from 'react';
import FormInput from './FormInput';
import { IFormInput } from './Simulate';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';

export interface IFormsProps {
    inputs: IFormInput[];
    updateInput: (id: string, val: number) => void;
    openTooltip: (id: string) => void;
}

function Forms(props: IFormsProps) {
    const g1 = props.inputs.filter((input) => input.group === 1);
    const g2 = props.inputs.filter((input) => input.group !== 1);
    return (
        <div className="Forms">
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <List>
                        {g1.map((input, i) => (
                            <ListItem key={i} button>
                                <FormInput
                                    key={i}
                                    input={input}
                                    updateInput={props.updateInput}
                                    openTooltip={props.openTooltip}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <List>
                        {g2.map((input, i) => (
                            <ListItem key={i} button>
                                <FormInput
                                    key={i}
                                    input={input}
                                    updateInput={props.updateInput}
                                    openTooltip={props.openTooltip}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </div>
    );
}

export default Forms;
