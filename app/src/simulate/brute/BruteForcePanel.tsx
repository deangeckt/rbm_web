import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { toggleType } from '../Simulate';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton, Tooltip } from '@material-ui/core';
import { AppContext } from '../../AppContext';
import { iconSizeStyle } from '../SimulatePanel';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { defTheme } from '../../Wrapper';

export interface IBruteForceProps {
    setToggle: (key: toggleType) => void;
    toggle: toggleType;
}

function BruteForcePanel({ setToggle, toggle }: IBruteForceProps) {
    const { state, setState } = useContext(AppContext);

    return (
        <>
            <div>
                <IconButton
                    color="primary"
                    size="medium"
                    onClick={() => {
                        setState({ ...state, bruteForceMode: false, theme: defTheme });
                        setToggle('Tree');
                    }}
                >
                    <ArrowBackIcon style={iconSizeStyle} />
                </IconButton>
                <Tooltip title="Seassion summary">
                    <IconButton
                        color="primary"
                        size="medium"
                        onClick={() => {
                            setState({ ...state, summaryState: true });
                        }}
                    >
                        <EventNoteIcon style={iconSizeStyle} />
                    </IconButton>
                </Tooltip>
            </div>
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
        </>
    );
}

export default BruteForcePanel;
