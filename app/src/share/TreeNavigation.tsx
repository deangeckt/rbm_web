import React from 'react';
import { Button } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import { useTreeNavigation } from './useTreeNavigation';

function TreeNavigation() {
    const { setNextChildSelected, setBackChildSelected, setBrotherChildSelected } = useTreeNavigation();

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
