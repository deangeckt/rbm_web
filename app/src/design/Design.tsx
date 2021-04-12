import React, { useContext } from 'react';
import ControlPanel from './ControlPanel';
import TopPanel from './TopPanel';
import DesignCanvas from './DesignCanvas';
import './Design.css';
import Navigation from './Navigation';
import { none_selected } from '../Wrapper';
import { AppContext } from '../Contexts/AppContext';

const Design = () => {
    const { state } = useContext(AppContext);

    return (
        <div className="Design">
            <div className="TopPanel">
                <TopPanel />
            </div>
            <div className="MainPanel">
                <div className="Canvas" id={'Canvas'}>
                    <DesignCanvas />
                </div>
                <div className="ControlPanel">
                    <ControlPanel />
                    {state.selectedId !== none_selected ? <Navigation /> : null}
                </div>
            </div>
        </div>
    );
};
export default Design;
