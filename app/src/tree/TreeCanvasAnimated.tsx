import React from 'react';
import AnimatedLine from './AnimatedLine';

function TreeCanvasAnimated() {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} id={'AnimCanvas'}>
            <AnimatedLine />
        </div>
    );
}

export default TreeCanvasAnimated;
