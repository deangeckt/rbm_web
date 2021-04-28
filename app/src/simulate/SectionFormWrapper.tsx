import React, { useContext } from 'react';
import Chip from '@material-ui/core/Chip';
import DynamicForm from './dynForms/DynamicForm';
import { AppContext } from '../AppContext';
import { useTreeText } from '../tree/useTreeText';
import { TextField, MenuItem } from '@material-ui/core';
import { section_recording } from '../Wrapper';
import { useDynamicForms } from './dynForms/useDynamicForm';
import './Form.css';

type SectionTab = 'process' | 'mech' | 'record';
const initTab: SectionTab = 'mech';

function SectionFormWrapper() {
    const [sectionTab, setSectionTab] = React.useState(initTab);
    const { state } = useContext(AppContext);
    const { sectionKeyToLabel } = useTreeText();
    const { getSectionRecording, updateSectionRecording, getSectionValue, updateSectionValue } = useDynamicForms();

    const selecedSections = Object.entries(state.checkedSections)
        .filter(([, added]) => added)
        .map(([k]) => sectionKeyToLabel(k));
    const renderForm = selecedSections.length > 0;
    const sectionListString = renderForm
        ? 'Editing Sections [' + selecedSections.join(' ') + ']'
        : 'Select some sections in the tree to edit';

    const renderTab = () => {
        if (sectionTab === 'mech') return <DynamicForm mp={state.pointMechanism} impKey={'pointMechanism'} />;
        else if (sectionTab === 'process') return <DynamicForm mp={state.pointProcess} impKey={'pointProcess'} />;
        else if (sectionTab === 'record')
            return (
                <TextField
                    select
                    label="Recording"
                    variant="filled"
                    value={getSectionRecording()}
                    onChange={(e) => updateSectionRecording(Number(e.target.value))}
                >
                    {section_recording.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            );
    };

    return (
        <div className="SectionForm">
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Chip
                    label="Mechanism"
                    clickable
                    color="primary"
                    variant={sectionTab === 'mech' ? 'default' : 'outlined'}
                    onClick={() => setSectionTab('mech')}
                />
                <Chip
                    label="Process"
                    clickable
                    color="primary"
                    variant={sectionTab === 'process' ? 'default' : 'outlined'}
                    onClick={() => setSectionTab('process')}
                />

                <Chip
                    label="Recording"
                    clickable
                    color="primary"
                    variant={sectionTab === 'record' ? 'default' : 'outlined'}
                    onClick={() => setSectionTab('record')}
                />
            </div>
            <div className="SectionEditStr">{sectionListString}</div>
            {renderForm ? (
                <>
                    <div style={{ marginBottom: '12px' }}>
                        <TextField
                            label={'Section'}
                            variant="filled"
                            type="number"
                            value={getSectionValue()}
                            onChange={(e) => updateSectionValue(Number(e.target.value))}
                            InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                        />
                    </div>
                    <div>{renderTab()}</div>
                </>
            ) : null}
        </div>
    );
}

export default SectionFormWrapper;
