import React from 'react';
import { IMechanismProcess } from '../../Wrapper';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import './Summary.css';

export interface IMechProcItemProps {
    id: string;
    item: IMechanismProcess;
}

function MechProcItem({ id, item }: IMechProcItemProps) {
    const attr = Object.entries(item.attrs);
    return (
        <div className="SummaryItem">
            <TreeView defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                <TreeItem nodeId={id} label={id}>
                    {attr.map(([att, value]) => {
                        return <TreeItem key={att} nodeId={att} label={`• ${att}: ${value}`} />;
                    })}
                </TreeItem>
            </TreeView>
        </div>
    );
}

export default MechProcItem;
