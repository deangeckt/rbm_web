import React, { useContext } from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Button } from '@material-ui/core';
import ReadLoading from '../anim/ReadLoading';
import { TreeOrPlot } from './Simulate';
import MenuIcon from '@material-ui/icons/Menu';
import { IconButton } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { downloadSwcFile, downloadJsonParams } from '../utils/general';
import { AppContext } from '../AppContext';
import { useDesignCanvas } from '../tree/useDesignCanvas';
import { useSimulate } from './useSimulate';

export interface ISimulatePanelProps {
    running: boolean;
    start: () => void;
    togglePlotTree: (key: TreeOrPlot) => void;
    toggle: TreeOrPlot;
}

function SimulatePanel({ running, start, togglePlotTree, toggle }: ISimulatePanelProps) {
    const { state } = useContext(AppContext);
    const { getLinesArrayNoRoot } = useDesignCanvas();
    const { getChangedForm } = useSimulate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton color="primary" size="medium" onClick={openMenu}>
                <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>
                <MenuItem
                    onClick={() => {
                        downloadSwcFile(state, getLinesArrayNoRoot());
                        closeMenu();
                    }}
                >
                    Export swc file
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        const { globalMechanism, sections } = getChangedForm();
                        downloadJsonParams(globalMechanism, sections);
                        closeMenu();
                    }}
                >
                    Export json param
                </MenuItem>
            </Menu>
            <div style={{ marginLeft: '16px' }}>
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
            <div style={{ marginRight: '16px' }}>
                {!running ? (
                    <Button
                        className="NoCapsButton"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            togglePlotTree('Plot');
                            start();
                        }}
                        startIcon={<PlayArrowIcon />}
                    >
                        Start
                    </Button>
                ) : (
                    <ReadLoading />
                )}
            </div>
        </>
    );
}

export default SimulatePanel;
