import React from 'react';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, Theme, createStyles, fade } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useTreeText } from './useTreeText';
import { useSimulateCanvas } from './useSimulateCanvas';

const useTreeItemStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {},
        content: {},
        group: {
            marginLeft: 7,
            paddingLeft: 18,
            borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
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

function TreeTextRecurItem({ ...other }: TreeItemProps) {
    const classes = useTreeItemStyles();
    const { sectionKeyToLabel, setSectionChecked, setMultipleSectionChecked, isSectionChecked } = useTreeText();
    const { setSelectedId } = useSimulateCanvas();

    const handleCheck = (event: any) => {
        setSectionChecked(other.nodeId);
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
            {sectionKeyToLabel(other.nodeId)}
        </span>
    );

    return (
        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    <Typography variant="body2" className={classes.labelText}>
                        {renderLabel(other.nodeId)}
                    </Typography>
                    <Checkbox
                        color="primary"
                        checked={isSectionChecked(other.nodeId)}
                        onClick={handleCheck}
                        onDoubleClick={() => {
                            setMultipleSectionChecked(other.nodeId);
                        }}
                    />
                </div>
            }
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
            }}
            {...other}
        />
    );
}

export default TreeTextRecurItem;
