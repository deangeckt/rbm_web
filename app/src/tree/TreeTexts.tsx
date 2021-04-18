import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TreeTextSection from './TreeTextSection';

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

function TreeTexts() {
    const { state } = useContext(AppContext);
    const classes = useStyles();

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <List>
                {Object.entries(state.sectionLines).map(([sec_key, sec]) => (
                    <ListItem key={sec_key} classes={{ root: classes.item }}>
                        <TreeTextSection sectionKey={sec_key} depth={sec.depth} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default TreeTexts;
