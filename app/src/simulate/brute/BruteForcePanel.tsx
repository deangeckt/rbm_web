import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { toggleType } from '../Simulate';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton, Tooltip } from '@material-ui/core';
import { AppContext } from '../../AppContext';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { iconSizeStyle } from '../../util/generalUtils';
import { useDialogs } from '../dialog/useDialogs';

export interface IBruteForceProps {
    setToggle: (key: toggleType) => void;
    toggle: toggleType;
}

function BruteForcePanel({ setToggle, toggle }: IBruteForceProps) {
    const { state, setState } = useContext(AppContext);
    const { toggleBruteResults } = useDialogs();

    return (
        <>
            <div>
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
                    variant={toggle === 'Plot' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setToggle('Plot')}
                >
                    Plot
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
                <Button
                    disabled={state.bruteResults.length === 0}
                    className="NoCapsButton"
                    variant={'contained'}
                    color="primary"
                    onClick={() => toggleBruteResults(true)}
                >
                    Results
                </Button>
            </div>
        </>
    );
}

export default BruteForcePanel;
