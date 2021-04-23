import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { none_selected } from '../Wrapper';
import { useTreeCanvas } from '../tree/useTreeCanvas';
import { downloadSwcFile } from '../utils/general';

function DesignTopPanel() {
    const { state, setState } = useContext(AppContext);
    const { getLinesArrayNoRoot, setSimulationTreeCids } = useTreeCanvas();
    const history = useHistory();

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
                    const { sectionLines, lines } = setSimulationTreeCids();
                    setState({ ...state, sectionLines: sectionLines, lines: lines, selectedId: none_selected });
                    history.push({ pathname: '/simulate' });
                }}
                style={{ marginRight: '24px' }}
            >
                Start Simulate
            </Button>
        </>
    );
}

export default DesignTopPanel;
