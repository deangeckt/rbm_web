import React, { useContext } from 'react';
import DesignControlPanel from './DesignControlPanel';
import TopPanel from './TopPanel';
import TreeCanvas from '../tree/TreeCanvas';
import TreeNavigation from '../tree/TreeNavigation';
import { none_selected } from '../Wrapper';
import { AppContext } from '../AppContext';
import './Design.css';

const Design = () => {
    const { state } = useContext(AppContext);

    return (
        <div className="Design">
            <div className="TopPanel">
                <TopPanel />
            </div>
            <div className="MainPanel">
                <div className="Canvas" id={'Canvas'}>
                    <TreeCanvas />
                </div>
                <div className="ControlPanel">
                    <DesignControlPanel />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {state.selectedId !== none_selected ? <TreeNavigation /> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Design;
