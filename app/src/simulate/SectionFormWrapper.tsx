import React, { useContext } from 'react';
import Chip from '@material-ui/core/Chip';
import DynamicForm from './dynForms/DynamicForm';
import { AppContext } from '../AppContext';
import { useTreeText } from '../tree/useTreeText';

type SectionTab = 'process' | 'mech' | 'record';
const initTab: SectionTab = 'mech';

function SectionFormWrapper() {
    const [sectionTab, setSectionTab] = React.useState(initTab);
    const { state } = useContext(AppContext);
    const { sectionKeyToLabel } = useTreeText();

    const selecedSections = Object.entries(state.selectedSections)
        .filter(([, added]) => added)
        .map(([k]) => sectionKeyToLabel(k));
    const renderForm = selecedSections.length > 0;
    const sectionListString = renderForm
        ? 'Editing Sections [' + selecedSections.join(' ') + ']'
        : 'Select some sections in the tree to edit';

    const renderTab = () => {
        if (sectionTab === 'mech') return <DynamicForm mp={state.pointMechanism} impKey={'pointMechanism'} />;
        else if (sectionTab === 'process') return <DynamicForm mp={state.pointProcess} impKey={'pointProcess'} />;
        else if (sectionTab === 'record') return <div>section 0.5</div>;
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
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
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    marginBottom: '16px',
                    borderBottom: '1px solid #efefef',
                }}
            >
                {sectionListString}
            </div>

            {renderForm ? renderTab() : null}
        </div>
    );
}

export default SectionFormWrapper;
