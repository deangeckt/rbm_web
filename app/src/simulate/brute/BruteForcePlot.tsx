import React from 'react';
import BruteForcePlotPanel from './BruteForcePlotPanel';
import FreeHandPlot from './FreeHandPlot';

export interface IBruteForcePlotProps {
    display: boolean;
}

export type BruteTab = 'draw' | 'import';
const initTab: BruteTab = 'draw';

function BruteForcePlot({ display }: IBruteForcePlotProps) {
    const [tab, setTab] = React.useState(initTab);

    return (
        <div style={{ height: '100%', width: '100%', display: display ? 'flex' : 'none', flexDirection: 'column' }}>
            <BruteForcePlotPanel tab={tab} setTab={setTab} />
            {tab === 'import' && <div>Import</div>}
            {tab === 'draw' && <FreeHandPlot />}
        </div>
    );
}

export default BruteForcePlot;
