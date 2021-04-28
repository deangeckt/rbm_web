import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { none_selected } from '../Wrapper';
import { useTreeCanvas } from '../tree/useTreeCanvas';
import { downloadSwcFile } from '../utils/general';
import { useTreeText } from '../tree/useTreeText';

function DesignTopPanel() {
    const { state, setState } = useContext(AppContext);
    const { getLinesArrayNoRoot, setSimulationTreeCids } = useTreeCanvas();
    const { sectionsToTreeRender } = useTreeText();
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
                    const { sections } = setSimulationTreeCids();
                    const treeText = sectionsToTreeRender(sections);
                    setState({
                        ...state,
                        sections: sections,
                        selectedId: none_selected,
                        sectionsTreeText: treeText,
                    });
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
