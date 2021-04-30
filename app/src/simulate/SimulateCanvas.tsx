import React, { useContext } from 'react';
import { none_selected_id, none_selected_key, root_id } from '../Wrapper';
import { AppContext } from '../AppContext';
import TreeCanvas from '../tree/TreeCanvas';
import TreeNavigation from '../tree/TreeNavigation';
import TreeTextRecur from '../tree/TreeTextRecur';
import './Simulate.css';

interface ISimulateCanvasProps {
    display: boolean;
}

const SimulateCanvas = ({ display }: ISimulateCanvasProps) => {
    const { state } = useContext(AppContext);
    const neuronSelected = state.selectedId === root_id;
    const lineSelected = state.selectedId !== none_selected_id && state.selectedId !== root_id;

    return (
        <div style={{ height: '100%', display: display ? undefined : 'none' }}>
            <div className="SimulateCanvasTree" id={'Canvas'}>
                <TreeCanvas design={false} />
            </div>
            <div className="SimulateCanvasBottomPanel">
                <div className="SimulateCanvasBottomLeft">
                    <TreeTextRecur />
                </div>
                <div className="SimulateCanvasBottomRight">
                    {!neuronSelected && !lineSelected ? (
                        <div>Select a section to travel the tree</div>
                    ) : (
                        <div>{state.selectedId !== none_selected_key ? <TreeNavigation design={false} /> : null}</div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default SimulateCanvas;
