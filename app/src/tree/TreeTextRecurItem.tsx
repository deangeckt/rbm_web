import React from 'react';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useTreeText } from './useTreeText';

const useTreeItemStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        content: {},
        group: {
            marginLeft: 0,
            '& $content': {
                paddingLeft: theme.spacing(2),
            },
        },
        expanded: {},
        selected: {},
        label: {},
        labelRoot: {
            display: 'flex',
            alignItems: 'center',
        },
        labelText: {},
    }),
);

type TreeTextRecurItemProps = TreeItemProps & {
    labelText: string;
};

function TreeTextRecurItem({ labelText, ...other }: TreeTextRecurItemProps) {
    const classes = useTreeItemStyles();
    const [check, setCheck] = React.useState(false);
    const { sectionKeyToLabel, isSectionSelected, setSectionChecked } = useTreeText();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheck(event.target.checked);
        // event.stopPropagation();
        event.preventDefault();
        // setSectionChecked(sectionKey);
    };

    // const renderLabel = (text: string) => (
    //     <span
    //         onClick={(event) => {
    //             console.log(text);
    //             //setActiveItemId(item.id);
    //             // if you want after click do expand/collapse comment this two line
    //             // event.stopPropagation();
    //             // event.preventDefault();
    //         }}
    //     >
    //         {text}
    //     </span>
    // );

    return (
        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    <Typography variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <Checkbox color="primary" checked={check} onChange={handleChange} />
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
