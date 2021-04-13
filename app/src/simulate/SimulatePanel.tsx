import React, { useContext } from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Button } from '@material-ui/core';

export interface ISimulatePanelProps {
    running: boolean;
    toggleRunning: Function;
}

function SimulatePanel({ running, toggleRunning }: ISimulatePanelProps) {
    return (
        <Button variant="outlined" color="primary" onClick={() => toggleRunning()} startIcon={<PlayArrowIcon />}>
            {!running ? 'Start' : 'Reset'}
        </Button>
    );
}

export default SimulatePanel;
