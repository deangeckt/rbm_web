import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IMechanismProcess, impKeys } from '../../Wrapper';
import DynamicAttr from './DynamicAttr';
import DynamicKeys from './DynamicKeys';
import './DynamicForm.css';
import { useDynamicForms } from './useDynamicForm';

export interface IDynamicFormProps {
    mp: IMechanismProcess[];
    impKey: impKeys;
}

function DynamicForm({ mp, impKey }: IDynamicFormProps) {
    const { state } = useContext(AppContext);
    const { getSectionCurrKeyIdx } = useDynamicForms();
    console.log(state);

    let selectedKeyIdx: number;
    if (impKey === 'globalMechanism') selectedKeyIdx = state.globalMechanismCurrKeyIdx;
    else selectedKeyIdx = getSectionCurrKeyIdx(impKey);

    const keys = mp.map((prop) => {
        return prop.key;
    });

    const vals = mp[selectedKeyIdx];
    const selectedAttrs = vals.attrs;
    const isSelectedKeyChecked = vals.add ?? false;
    const selectedKey = vals.key;

    return (
        <div style={{ display: 'flex' }}>
            <div className="DynLeftSide">
                <DynamicKeys impKey={impKey} keys={keys} selectedKey={selectedKey} />
            </div>
            <div className="DynRightSide">
                <DynamicAttr
                    impKey={impKey}
                    attrs={selectedAttrs}
                    attr_key={selectedKey}
                    checked={isSelectedKeyChecked}
                />
            </div>
        </div>
    );
}

export default DynamicForm;
