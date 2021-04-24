import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import DynamicForm from './dynForms/DynamicForm';
import { AppContext } from '../AppContext';
import SectionFormWrapper from './SectionFormWrapper';
import './Form.css';

type SimTab = 'Global' | 'Section';
const initTab: SimTab = 'Global';

function SimulateMainForm() {
    const { state } = useContext(AppContext);
    const [tab, setTab] = React.useState(initTab);

    const renderTab = () => {
        if (tab === 'Global') return <DynamicForm mp={state.globalMechanism} impKey={'globalMechanism'} />;
        else return <SectionFormWrapper />;
    };

    return (
        <div className="TabsContainer">
            <div className="Tabs">
                <Button
                    className="MainTabButton"
                    variant={tab === 'Global' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setTab('Global')}
                >
                    Global
                </Button>
                <Button
                    className="MainTabButton"
                    variant={tab === 'Section' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setTab('Section')}
                >
                    Section
                </Button>
            </div>
            <div className="MainForm">{renderTab()}</div>
        </div>
    );
}

export default SimulateMainForm;
