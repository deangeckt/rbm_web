import React, { useContext } from 'react';
import Chip from '@material-ui/core/Chip';
import DynamicForm from './dynForms/DynamicForm';
import { AppContext } from '../AppContext';

type SectionTab = 'process' | 'mech';
const initTab: SectionTab = 'mech';

function SectionFormWrapper() {
    const [sectionTab, setSectionTab] = React.useState(initTab);
    const { state } = useContext(AppContext);

    const renderTab = () => {
        if (sectionTab === 'mech') return <DynamicForm mp={state.pointMechanism} impKey={'pointMechanism'} />;
        else if (sectionTab === 'process') return <DynamicForm mp={state.pointProcess} impKey={'pointProcess'} />;
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
            </div>
            {renderTab()}
        </div>
    );
}

export default SectionFormWrapper;
