import React from 'react';
import { IMechanismProcess } from '../../Wrapper';
import './Summary.css';

export interface IMechProcItemProps {
    id: string;
    item: IMechanismProcess;
}

function MechProcItem({ id, item }: IMechProcItemProps) {
    const attr = Object.entries(item.attrs);
    return (
        <div className="SummaryItem">
            <div className="SummaryKey">{id}:</div>
            {attr.map(([att, value]) => {
                return (
                    <div key={att} className="SummaryAttr">
                        • {att}: {value}
                    </div>
                );
            })}
        </div>
    );
}

export default MechProcItem;
