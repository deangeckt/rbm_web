import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { exportFile } from '../utils/SwcUtils';
import { AppContext } from '../AppContext';
import { IAppState, none_selected, ILine } from '../Wrapper';
import { useTreeCanvas } from '../tree/useTreeCanvas';

const downloadFile = (state: IAppState, linesArray: ILine[]) => {
    // TODO: remove redundant element created
    const element = document.createElement('a');
    const file = new Blob(exportFile(linesArray, state.neuronRadius, state.stage.rootX, state.stage.rootY), {
        type: 'text/plain;charset=utf-8',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'swcTree.swc';
    document.body.appendChild(element);
    element.click();
};

function TopPanel() {
    const { state } = useContext(AppContext);
    const { setSelectedId, getLinesArray } = useTreeCanvas();
    const history = useHistory();

    return (
        <>
            <Button
                className="NoCapsButton"
                color="primary"
                variant="contained"
                onClick={() => downloadFile(state, getLinesArray())}
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
                    setSelectedId(none_selected);
                    history.push({ pathname: '/simulate' });
                }}
                style={{ marginRight: '24px' }}
            >
                Start Simulate
            </Button>
        </>
    );
}

export default TopPanel;
