import React from 'react';
import { Button } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import './ControlPanel.css';

export interface INavigationProps {
    setNext: Function;
    setBack: Function;
    setBrother: Function;
}

function Navigation({setNext, setBack, setBrother} : INavigationProps) {
	return (
    <div className="NavPanel">

        <Button className="Button" variant="outlined" color="primary" startIcon={<NavigateNextIcon />}
                onClick={() => setNext()}>
            Select Child
        </Button>
        <Button className="Button" variant="outlined" color="primary" startIcon={<NavigateBeforeIcon />}
                onClick={() => setBack()}>
            Select Parent
        </Button>
        <Button className="Button" variant="outlined" color="primary" startIcon={<CallSplitIcon />}
                onClick={() => setBrother()}>
            Select Sibling
        </Button>
    </div>
  );
}

export default Navigation;
