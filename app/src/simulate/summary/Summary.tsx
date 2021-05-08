import React, { useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { AppContext } from '../../AppContext';
import { useSimulate } from '../useSimulate';
import MechProcItem from './MechProcItem';
import SectionItem from './SectionItem';
import './Summary.css';

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
                <div className="SummaryContainer">
                    <div className="SummaryHeader">Global Mechanism</div>
                    {Object.entries(globalMechanism).map(([name, mech]) => {
                        return <MechProcItem key={name} id={name} item={mech} />;
                    })}

                    <div className="SummaryHeader">Sections</div>
                    {Object.values(sections).map((sec) => {
                        return <SectionItem key={sec.id} section={sec} />;
                    })}
                </div>
            </Drawer>
        </div>
    );
}

export default Summary;
