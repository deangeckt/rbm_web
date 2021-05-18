import React from 'react';
import { impKeys, singleAttrObj } from '../../Wrapper';
import DynamicAttr from './DynamicAttr';
import DynamicKeys from './DynamicKeys';
import { useDynamicForms } from './useDynamicForm';
import './DynamicForm.css';

export interface IDynamicFormProps {
    mp: singleAttrObj;
    impKey: impKeys;
}

function DynamicForm({ mp, impKey }: IDynamicFormProps) {
    const { getDynamicFormProps } = useDynamicForms();
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
