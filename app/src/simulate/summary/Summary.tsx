import React, { useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { AppContext } from '../../AppContext';
import { useSimulate } from '../useSimulate';
import MechProcItem from './MechProcItem';
import SectionItem from './SectionItem';
import TextField from '@material-ui/core/TextField';
import { sectionKeyToLabel } from '../../util/generalUtils';
import { SectionScheme } from '../../Wrapper';
import Autocomplete from '@mui/material/Autocomplete';

import './Summary.css';

type SearchedSection = SectionScheme | undefined;
const noSearch: SearchedSection = undefined;

function Summary() {
    const { state, setState } = useContext(AppContext);
    const { getChangedForm } = useSimulate();
    const { globalMechanism, sections } = getChangedForm();
    const [search, setSearch] = React.useState(noSearch);

    const section_ids = Object.values(sections).map((sec) => {
        return { label: sectionKeyToLabel(sec.id), sec: sec };
    });
    return (
        <div>
            <Drawer
                anchor={'left'}
                open={state.summaryState}
                onClose={() => setState({ ...state, summaryState: false })}
            >
                <div className="SummaryContainer">
                    <div className="SummarySearch">
                        <Autocomplete
                            options={section_ids}
                            getOptionLabel={(option) => option.label}
                            // getOptionSelected={(option, value) => option.sec.id === value.sec.id}
                            onChange={(_event, value) => setSearch(value?.sec ?? undefined)}
                            style={{ width: 200 }}
                            renderInput={(params) => (
                                <TextField {...params} label="Search section" variant="outlined" />
                            )}
                        />
                    </div>
                    <div className="SummaryHeader">Global Mechanism</div>
                    {Object.entries(globalMechanism).map(([name, mech]) => {
                        return <MechProcItem key={name} id={name} item={mech} />;
                    })}

                    <div className="SummaryHeader">Sections</div>
                    {!search ? (
                        Object.values(sections).map((sec, i) => {
                            return <SectionItem key={`${sec.id}_${i}`} section={sec} />;
                        })
                    ) : (
                        <SectionItem section={search} />
                    )}
                </div>
            </Drawer>
        </div>
    );
}

export default Summary;
