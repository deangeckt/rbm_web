import React, { useContext } from 'react';
import DesignControlPanel from './DesignControlPanel';
import DesignTopPanel from './DesignTopPanel';
import TreeCanvas from '../tree/TreeCanvas';
import TreeNavigation from '../tree/TreeNavigation';
import { none_selected_id } from '../Wrapper';
import { AppContext } from '../AppContext';
import './Design.css';

const Design = () => {
    const { state } = useContext(AppContext);

    return (
        <div className="Design">
            <div className="TopPanel">
                <DesignTopPanel />
            </div>
            <div className="MainPanel">
                <div className="Canvas" id={'Canvas'}>
                    <TreeCanvas design={true} />
                </div>
                <div className="ControlPanel">
                    <DesignControlPanel />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {state.selectedId !== none_selected_id ? <TreeNavigation design={true} /> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Design;
