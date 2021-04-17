import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { section_types } from '../Wrapper';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
        item: {
            padding: 0,
            margin: 0,
        },
    }),
);

function TreeText() {
    const { state, setState } = useContext(AppContext);
    // const lines = [...state.lines];
    const classes = useStyles();
    const margin = '2ex';

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <List dense={false}>
                {state.lines.map((l) => (
                    <ListItem key={l.id} classes={{ root: classes.item }}>
                        <div key={l.id} style={{ display: 'flex', flexDirection: 'row', marginLeft: margin }}>
                            <IconButton color="primary" component="span">
                                <AddIcon />
                            </IconButton>
                            <FormControlLabel
                                control={<Checkbox color="primary" checked={true} />}
                                label={section_types.find((sec_type) => sec_type.value === l.tid)!.label}
                            />
                        </div>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default TreeText;
