import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import ReadLoading from '../../anim/ReadLoading';
import { toggleType } from '../Simulate';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from '@material-ui/core';
import { AppContext } from '../../AppContext';
import { iconSizeStyle } from '../SimulatePanel';

export interface IBruteForceProps {
    running: boolean;
    start: () => void;
    setToggle: (key: toggleType) => void;
    toggle: toggleType;
}

function BruteForcePanel({ running, start, setToggle, toggle }: IBruteForceProps) {
    const { state, setState } = useContext(AppContext);

    return (
        <>
            <IconButton
                color="primary"
                size="medium"
                onClick={() => {
                    setState({ ...state, bruteForceMode: false });
                    setToggle('Tree');
                }}
            >
                <ArrowBackIcon style={iconSizeStyle} />
            </IconButton>
            <div style={{ marginLeft: '16px' }}>
                <Button
                    className="NoCapsButton"
                    variant={toggle === 'Tree' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setToggle('Tree')}
                >
                    Tree
                </Button>
                <Button
                    className="NoCapsButton"
                    variant={toggle === 'FreeHand' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setToggle('FreeHand')}
                >
                    Draw Plot
                </Button>
            </div>
            <div style={{ marginRight: '16px' }}>
                {!running ? (
                    <Button
                        className="NoCapsButton"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            start();
                        }}
                        startIcon={<PlayArrowIcon />}
                    >
                        Run
                    </Button>
                ) : (
                    <ReadLoading />
                )}
            </div>
        </>
    );
}

export default BruteForcePanel;
