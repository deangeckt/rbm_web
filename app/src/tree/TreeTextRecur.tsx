/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { makeStyles } from '@material-ui/core/styles';
import TreeTextRecurItem from './TreeTextRecurItem';
import { RenderTreeText, root_key } from '../Wrapper';
import { AppContext } from '../AppContext';
import { useTreeText } from './useTreeText';
// import { TreeView } from '@mui/lab';
// import { TreeView } from '@mui/x-tree-view/TreeView';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

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
        console.log('nodes', state.sectionsTreeText),
        (
            <TreeTextRecurItem key={nodes.id} nodeId={nodes.id} itemId={nodes.id}>
                {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
            </TreeTextRecurItem>
        )
    );

    return (
        <SimpleTreeView
            className={classes.root}
            // defaultCollapseIcon={<ExpandMoreIcon />}
            // defaultExpanded={all}
            // defaultExpandIcon={<ChevronRightIcon />}
            // selected={[state.selectedId]}
        >
            {renderTree(state.sectionsTreeText)}
        </SimpleTreeView>
    );
}
