import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../AppContext';
import { useDesignCanvas } from '../tree/useDesignCanvas';
import { downloadSwcFile } from '../util/exportUtils';

function DesignTopPanel() {
    const { state } = useContext(AppContext);
    const { getLinesArrayNoRoot } = useDesignCanvas();
    const navigate = useNavigate();

    return (
        <>
            <Button
                className="NoCapsButton"
                color="primary"
                variant="contained"
                onClick={() => downloadSwcFile(state, getLinesArrayNoRoot())}
                style={{ marginLeft: '24px' }}
            >
                Export
            </Button>
            <big style={{ color: 'black', display: 'block', fontSize: '26px' }}>RBM - Create your Neuron</big>
            <Button
                className="NoCapsButton"
                color="primary"
                variant="contained"
                onClick={() => {
                    navigate({ pathname: '/simulate' });
                }}
                style={{ marginRight: '24px' }}
            >
                Start Simulate
            </Button>
        </>
    );
}

export default DesignTopPanel;
