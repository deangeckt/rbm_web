import React, { useContext } from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Button, Checkbox, Tooltip } from '@material-ui/core';
import ReadLoading from '../anim/ReadLoading';
import { toggleType } from './Simulate';
import MenuIcon from '@material-ui/icons/Menu';
import { IconButton } from '@material-ui/core';
import SportsMmaIcon from '@material-ui/icons/SportsMma';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { downloadSwcFile, downloadPlots } from '../util/exportUtils';
import { AppContext } from '../AppContext';
import { useDesignCanvas } from '../tree/useDesignCanvas';
import { useSimulate } from './useSimulate';
import { useDialogs } from './dialog/useDialogs';
import ExportSeassionDialog from './dialog/ExportSeassionDialog';
import EventNoteIcon from '@material-ui/icons/EventNote';

export interface ISimulatePanelProps {
    running: boolean;
    start: () => void;
    onErr: (err: string) => void;
    setToggle: (key: toggleType) => void;
    toggle: toggleType;
}

export const iconSizeStyle = { width: '30px', height: '30px' };

function SimulatePanel({ running, start, onErr, setToggle, toggle }: ISimulatePanelProps) {
    const { state, setState } = useContext(AppContext);
    const { getLinesArrayNoRoot } = useDesignCanvas();
    const { importJsonParams } = useSimulate();
    const { toggleExport } = useDialogs();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <ExportSeassionDialog />
            <div>
                <IconButton color="primary" size="medium" onClick={openMenu}>
                    <MenuIcon style={iconSizeStyle} />
                </IconButton>
                <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>
                    <MenuItem>
                        Include heatmap
                        <Tooltip title="This will increase run time">
                            <Checkbox
                                color="primary"
                                checked={state.addAnims}
                                onClick={() => {
                                    setState({ ...state, addAnims: !state.addAnims });
                                }}
                            />
                        </Tooltip>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            toggleExport(true);
                            closeMenu();
                        }}
                    >
                        Export session params
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            closeMenu();
                        }}
                        component="label"
                    >
                        Import session params
                        <input type="file" accept={'.json'} hidden onChange={(e) => importJsonParams(e, onErr)} />
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            downloadPlots(state.plots);
                            closeMenu();
                        }}
                    >
                        Export plots
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            downloadSwcFile(state, getLinesArrayNoRoot());
                            closeMenu();
                        }}
                    >
                        Export swc file
                    </MenuItem>
                </Menu>
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
                <Tooltip title="Brute force">
                    <IconButton
                        color="primary"
                        size="medium"
                        onClick={() => {
                            setState({ ...state, bruteForceMode: true });
                            setToggle('FreeHand');
                        }}
                    >
                        <SportsMmaIcon style={iconSizeStyle} />
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
                    variant={toggle === 'Anim' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setToggle('Anim')}
                >
                    HeatMap
                </Button>
            </div>
            <div style={{ marginRight: '16px' }}>
                {!running ? (
                    <Button
                        className="NoCapsButton"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setToggle('Plot');
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

export default SimulatePanel;
