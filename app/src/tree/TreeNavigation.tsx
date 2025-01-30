import React from 'react';
import { Button } from '@material-ui/core';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import { useDesignTreeNavigation } from './useDesignTreeNavigation';
import { ITreeCanvasProps } from './TreeCanvas';
import { useSimulateTreeNavigation } from './useSimulateTreeNavigation';

function TreeNavigation({ design }: ITreeCanvasProps) {
    const { setNextChildSelected, setBackChildSelected, setBrotherChildSelected } = design
        ? useDesignTreeNavigation()
        : useSimulateTreeNavigation();

    return (
        <>
            {' '}
            <Button
                className="Button"
                variant="outlined"
                color="primary"
                startIcon={<NavigateNextIcon />}
                onClick={() => setNextChildSelected()}
            >
                Select Child
            </Button>
            <Button
                className="Button"
                variant="outlined"
                color="primary"
                startIcon={<NavigateBeforeIcon />}
                onClick={() => setBackChildSelected()}
            >
                Select Parent
            </Button>
            <Button
                className="Button"
                variant="outlined"
                color="primary"
                startIcon={<CallSplitIcon />}
                onClick={() => setBrotherChildSelected()}
            >
                Select Sibling
            </Button>
        </>
    );
}

export default TreeNavigation;
