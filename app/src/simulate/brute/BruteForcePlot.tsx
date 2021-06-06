import React from 'react';
import BruteForcePlotPanel from './BruteForcePlotPanel';
import FreeHandPlot from './FreeHandPlot';

export interface IBruteForcePlotProps {
    display: boolean;
}

function BruteForcePlot({ display }: IBruteForcePlotProps) {
    return (
        <div style={{ height: '100%', width: '100%', display: display ? 'flex' : 'none', flexDirection: 'column' }}>
            <BruteForcePlotPanel />
            <FreeHandPlot />
        </div>
    );
}

export default BruteForcePlot;
