import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core/styles';
import TreeTextRecurItem from './TreeTextRecurItem';

export interface RenderTree {
    id: string;
    name: string;
    children?: RenderTree[];
}

const data: RenderTree = {
    id: 'root',
    name: 'Parent',
    children: [
        {
            id: '1',
            name: 'Child - 1',
        },
        {
            id: '3',
            name: 'Child - 3',
            children: [
                {
                    id: '4',
                    name: 'Child - 4',
                },
            ],
        },
    ],
};

const useStyles = makeStyles({
    root: {
        height: '100%',
        width: '100%',
    },
});

// TODO pass section lines data root - no need to pass name
export default function TreeTextRecur() {
    const classes = useStyles();

    const renderTree = (nodes: RenderTree) => (
        <TreeTextRecurItem key={nodes.id} nodeId={nodes.id} labelText={nodes.name}>
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
            {renderTree(data)}
        </TreeView>
    );
}
