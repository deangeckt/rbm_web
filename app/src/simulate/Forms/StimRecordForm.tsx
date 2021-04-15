import { Button, Grid, List, ListItem } from '@material-ui/core';
import React, { useContext } from 'react';
import { AppContext } from '../../Contexts/AppContext';
import StimInput from './StimInput';
import { useSimulate } from '../useSimulate';
import AddIcon from '@material-ui/icons/Add';
import RecordInput from './RecordInput';

export interface IStimRecordProps {
    stim: boolean;
}

function StimRecordForm({ stim }: IStimRecordProps) {
    const { state } = useContext(AppContext);
    const { addStim, addRecord } = useSimulate();

    return (
        <div style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    onClick={() => (stim ? addStim() : addRecord())}
                    startIcon={<AddIcon />}
                >
                    Add
                </Button>
                <big style={{ color: 'black', display: 'block', fontSize: '14px', marginLeft: '14px' }}>
                    OR click on the tree
                </big>
            </div>

            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <List>
                        {stim
                            ? state.stims.map((stim, i) => (
                                  <ListItem key={i}>
                                      <StimInput key={i} idx={i} stim={stim} />
                                  </ListItem>
                              ))
                            : state.records.map((record, i) => (
                                  <ListItem key={i}>
                                      <RecordInput key={i} idx={i} record={record} />
                                  </ListItem>
                              ))}
                    </List>
                </Grid>
            </Grid>
        </div>
    );
}

export default StimRecordForm;
