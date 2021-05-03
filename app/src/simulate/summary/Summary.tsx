import React, { useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { AppContext } from '../../AppContext';
import { useSimulate } from '../useSimulate';
import MechProcItem from './MechProcItem';

function Summary() {
    const { state, setState } = useContext(AppContext);
    const { getChangedForm } = useSimulate();
    const { globalMechanism, sections } = getChangedForm();

    return (
        <div>
            <Drawer
                anchor={'left'}
                open={state.summaryState}
                onClose={() => setState({ ...state, summaryState: false })}
            >
                <div
                    style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '16px' }}
                >
                    <div style={{ fontWeight: 600, marginTop: '16px', fontSize: 'large' }}>Global:</div>
                    {Object.entries(globalMechanism).map(([name, mech]) => {
                        return <MechProcItem key={name} id={name} item={mech} />;
                    })}
                    <div style={{ fontWeight: 600, marginTop: '16px', fontSize: 'large' }}>Sections:</div>
                </div>
            </Drawer>
        </div>
    );
}

export default Summary;
