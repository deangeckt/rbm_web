import React, { useContext } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core/styles';
import TreeTextRecurItem from './TreeTextRecurItem';
import { RenderTreeText } from '../Wrapper';
import { AppContext } from '../AppContext';

const useStyles = makeStyles({
    root: {
        height: '100%',
        width: '100%',
    },
});

export default function TreeTextRecur() {
    const classes = useStyles();
    const { state } = useContext(AppContext);

    const renderTree = (nodes: RenderTreeText) => (
        <TreeTextRecurItem key={nodes.id} nodeId={nodes.id}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeTextRecurItem>
    );

    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['root']}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {renderTree(state.sectionsTreeText)}
        </TreeView>
    );
}
