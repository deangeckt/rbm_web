import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Button } from '@material-ui/core';
import ReadLoading from '../anim/ReadLoading';
import { TreeOrPlot } from './Simulate';

export interface ISimulatePanelProps {
    running: boolean;
    start: () => void;
    togglePlotTree: (key: TreeOrPlot) => void;
    toggle: TreeOrPlot;
}

function SimulatePanel({ running, start, togglePlotTree, toggle }: ISimulatePanelProps) {
    return (
        <>
            <div style={{ marginLeft: '16px' }}>
                {!running ? (
                    <Button
                        className="NoCapsButton"
                        variant="contained"
                        color="primary"
                        onClick={() => start()}
                        startIcon={<PlayArrowIcon />}
                    >
                        Start
                    </Button>
                ) : (
                    <ReadLoading />
                )}
            </div>

            <div style={{ marginRight: '16px' }}>
                <Button
                    className="NoCapsButton"
                    variant={toggle === 'Plot' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => togglePlotTree('Plot')}
                >
                    Plot
                </Button>
                <Button
                    className="NoCapsButton"
                    variant={toggle === 'Tree' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => togglePlotTree('Tree')}
                >
                    Tree
                </Button>
            </div>
        </>
    );
}

export default SimulatePanel;
