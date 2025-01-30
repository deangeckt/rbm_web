import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { toggleType } from '../Simulate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Tooltip } from '@material-ui/core';
import { AppContext } from '../../AppContext';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { iconSizeStyle } from '../../util/generalUtils';
import { useDialogs } from '../dialog/useDialogs';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useBruteForce } from './useBruteForce';

export interface IBruteForceProps {
    setToggle: (key: toggleType) => void;
    toggle: toggleType;
}

function BruteForcePanel({ setToggle, toggle }: IBruteForceProps) {
    const { state, setState } = useContext(AppContext);
    const { toggleBruteResults, toggleBruteConsent } = useDialogs();
    const { isRunValid } = useBruteForce();

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
                    variant={toggle === 'Brute' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setToggle('Brute')}
                >
                    Brute Force
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
                <Button
                    disabled={!isRunValid()}
                    className="NoCapsButton"
                    variant="outlined"
                    color="primary"
                    onClick={() => toggleBruteConsent(true)}
                    startIcon={<PlayArrowIcon />}
                >
                    Run
                </Button>
            </div>
        </>
    );
}

export default BruteForcePanel;
