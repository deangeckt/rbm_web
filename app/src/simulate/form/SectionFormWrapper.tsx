import React, { useContext } from 'react';
import DynamicForm from '../dynForms/DynamicForm';
import { AppContext } from '../../AppContext';
import SectionFormSegmentHeader from './SectionFormSegmentHeader';
import SectionFormRecording from './SectionFormRecording';
import SectionFormGeneral from './SectionFormGeneral';
import { sectionKeyToLabel } from '../../util/generalUtils';
import SectionFormGeneralBrute from '../brute/SectionFormGeneralBrute';
import NavButton from '../../util/NavButton';
import './Form.css';

type SectionTab = 'process' | 'mech' | 'record' | 'general';
const initTab: SectionTab = 'general';

function SectionFormWrapper() {
    const [sectionTab, setSectionTab] = React.useState(initTab);
    const { state } = useContext(AppContext);

    const selecedSections = Object.entries(state.checkedSections)
        .filter(([, added]) => added)
        .map(([k]) => sectionKeyToLabel(k));
    const renderForm = selecedSections.length > 0;
    const sectionListString = renderForm
        ? 'Editing Sections [' + selecedSections.join(' ') + ']'
        : 'Check some sections in the tree to edit\ndouble click to check all sub sections';

    const renderTab = () => {
        if (sectionTab === 'mech') return <DynamicForm mp={state.pointMechanism} impKey={'pointMechanism'} />;
        else if (sectionTab === 'process') return <DynamicForm mp={state.pointProcess} impKey={'pointProcess'} />;
        else if (sectionTab === 'record') return <SectionFormRecording />;
        else if (sectionTab === 'general')
            return state.bruteForceMode ? <SectionFormGeneralBrute /> : <SectionFormGeneral />;
    };

    React.useEffect(() => {
        if ((state.bruteForceMode && sectionTab === 'process') || sectionTab === 'record') setSectionTab('general');
    }, [state.bruteForceMode]);

    return (
        <div className="SectionForm">
            <div className="SctionFormNav">
                <NavButton
                    label={'General'}
                    isSelected={sectionTab === 'general'}
                    select={() => setSectionTab('general')}
                />
                <NavButton
                    label={'Mechanism'}
                    isSelected={sectionTab === 'mech'}
                    select={() => setSectionTab('mech')}
                />
                {!state.bruteForceMode && (
                    <>
                        <NavButton
                            label={'Process'}
                            isSelected={sectionTab === 'process'}
                            select={() => setSectionTab('process')}
                        />
                        <NavButton
                            label={'Recording'}
                            isSelected={sectionTab === 'record'}
                            select={() => setSectionTab('record')}
                        />
                    </>
                )}
            </div>
            <div className="SectionEditStr">{sectionListString}</div>
            {renderForm ? (
                <>
                    {sectionTab === 'process' || sectionTab === 'record' ? <SectionFormSegmentHeader /> : null}
                    <div>{renderTab()}</div>
                </>
            ) : null}
        </div>
    );
}

export default SectionFormWrapper;
