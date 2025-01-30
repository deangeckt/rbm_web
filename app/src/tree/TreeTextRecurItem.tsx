import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useTreeText } from './useTreeText';
import { useSimulateCanvas } from './useSimulateCanvas';
import { sectionKeyToLabel } from '../util/generalUtils';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useTreeItemStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {},
        content: {},
        group: {
            marginLeft: 7,
            paddingLeft: 18,
            // borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
        },
        expanded: {},
        selected: {},
        label: {},
        labelRoot: {
            display: 'flex',
            alignItems: 'center',
        },
        labelText: {},
    });
});

function TreeTextRecurItem({ nodeId, ...other }: TreeItemProps & { nodeId: string }) {
    const classes = useTreeItemStyles();
    const { setSectionChecked, setMultipleSectionChecked, isSectionChecked } = useTreeText();
    const { setSelectedId } = useSimulateCanvas();

    const handleCheck = (event: any) => {
        setSectionChecked(nodeId);
        event.stopPropagation();
        event.preventDefault();
    };

    const renderLabel = (id: string) => (
        <span
            onClick={(event) => {
                setSelectedId(id);
                event.stopPropagation();
                event.preventDefault();
            }}
        >
            {sectionKeyToLabel(nodeId)}
        </span>
    );

    return (
        <TreeItem
            // nodeId={nodeId}
            label={
                <div className={classes.labelRoot}>
                    <Typography variant="body2" className={classes.labelText}>
                        {renderLabel(nodeId)}
                    </Typography>
                    <Checkbox
                        color="primary"
                        checked={isSectionChecked(nodeId)}
                        onClick={handleCheck}
                        onDoubleClick={() => {
                            setMultipleSectionChecked(nodeId);
                        }}
                    />
                </div>
            }
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                // group: classes.group,
                label: classes.label,
            }}
            {...other}
        />
    );
}

export default TreeTextRecurItem;
