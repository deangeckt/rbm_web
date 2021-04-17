import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

function TreeText() {
    const { state, setState } = useContext(AppContext);
    // const lines = [...state.lines];

    return (
        <>
            {state.lines.map((l) => (
                <div key={l.id}>{l.cid}</div>
            ))}
        </>
    );
}

export default TreeText;
