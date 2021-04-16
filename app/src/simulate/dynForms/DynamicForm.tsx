import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IMechanismProcess, impKeys } from '../../Wrapper';
import DynamicAttr from './DynamicAttr';
import DynamicKeys from './DynamicKeys';
import './DynamicForm.css';

export interface IDynamicFormProps {
    mp: IMechanismProcess[];
    impKey: impKeys;
}

function DynamicForm({ mp, impKey }: IDynamicFormProps) {
    const { state } = useContext(AppContext);

    const selectedKey = state.mechProcKeySelected;
    const keys = mp.map((prop) => {
        return prop.key;
    });

    const vals = mp.find((mp_val) => mp_val.key === selectedKey);
    const selectedAttrs = vals?.attrs ?? [];
    const isSelectedKeyChecked = vals?.add ?? false;

    return (
        <div style={{ display: 'flex' }}>
            <div className="DynLeftSide">
                <DynamicKeys keys={keys} />
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
