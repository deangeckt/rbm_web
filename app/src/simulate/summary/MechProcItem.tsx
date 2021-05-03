import React from 'react';
import { IMechanismProcess } from '../../Wrapper';

export interface IMechProcItemProps {
    id: string;
    item: IMechanismProcess;
}

function MechProcItem({ id, item }: IMechProcItemProps) {
    const attr = Object.entries(item.attrs);
    console.log(id);
    return (
        <>
            <div>{id}</div>
            {attr.map(([att, value]) => {
                return (
                    <div key={att} style={{ marginLeft: '16px' }}>
                        {att}: {value}
                    </div>
                );
            })}
        </>
    );
}

export default MechProcItem;
