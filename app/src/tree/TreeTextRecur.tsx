import React, { useContext } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core/styles';
import TreeTextRecurItem from './TreeTextRecurItem';
import { RenderTreeText, root_key } from '../Wrapper';
import { AppContext } from '../AppContext';
import { useTreeText } from './useTreeText';

const useStyles = makeStyles({
    root: {
        height: '100%',
        width: '100%',
    },
});

export default function TreeTextRecur() {
    const classes = useStyles();
    const { state } = useContext(AppContext);
    const { getTreeChildrenRecur } = useTreeText();
    const all: string[] = [root_key];

    React.useEffect(() => {
        getTreeChildrenRecur(root_key, all);
    }, []);

    const renderTree = (nodes: RenderTreeText) => (
        <TreeTextRecurItem key={nodes.id} nodeId={nodes.id}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeTextRecurItem>
    );

    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={all}
            defaultExpandIcon={<ChevronRightIcon />}
            selected={[state.selectedId]}
        >
            {renderTree(state.sectionsTreeText)}
        </TreeView>
    );
}
