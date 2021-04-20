import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IMechanismProcess, impKeys } from '../../Wrapper';
import DynamicAttr from './DynamicAttr';
import DynamicKeys from './DynamicKeys';
import './DynamicForm.css';
import { useDynamicForms } from './useDynamicForm';

export interface IDynamicFormProps {
    mp: Record<string, IMechanismProcess>;
    impKey: impKeys;
}

function DynamicForm({ mp, impKey }: IDynamicFormProps) {
    const { state } = useContext(AppContext);
    const { getDynamicFormProps } = useDynamicForms();
    console.log(state);

    const { selectedKey, selectedAttrs, isSelectedKeyChecked } = getDynamicFormProps(impKey);

    const keys = Object.keys(mp).map((key) => {
        return key;
    });

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
