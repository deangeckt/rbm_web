import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Button } from '@material-ui/core';
import ReadLoading from '../anim/ReadLoading';

export interface ISimulatePanelProps {
    running: boolean;
    start: Function;
}

function SimulatePanel({ running, start }: ISimulatePanelProps) {
    return (
        <>
            {!running ? (
                <Button variant="outlined" color="primary" onClick={() => start()} startIcon={<PlayArrowIcon />}>
                    Start
                </Button>
            ) : (
                <ReadLoading />
            )}
        </>
    );
}

export default SimulatePanel;
