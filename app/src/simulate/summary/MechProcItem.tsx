import React from 'react';
import { IMechanismProcess } from '../../Wrapper';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view';

import './Summary.css';

export interface IMechProcItemProps {
    id: string;
    item: IMechanismProcess;
}

function MechProcItem({ id, item }: IMechProcItemProps) {
    const attr = Object.entries(item.attrs);
    return (
        <div className="SummaryItem">
            <SimpleTreeView>
                <TreeItem itemId={id} label={id}>
                    {attr.map(([att, value]) => {
                        return <TreeItem key={att} itemId={att} label={`• ${att}: ${value}`} />;
                    })}
                </TreeItem>
            </SimpleTreeView>
        </div>
    );
}

export default MechProcItem;
