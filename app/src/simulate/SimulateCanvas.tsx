import React, { useContext } from 'react';
import { none_selected, root_id } from '../Wrapper';
import { AppContext } from '../AppContext';
import TreeCanvas from '../tree/TreeCanvas';
import TreeNavigation from '../tree/TreeNavigation';
import TreeTexts from '../tree/TreeTexts';
import './Simulate.css';

const SimulateCanvas = () => {
    const { state } = useContext(AppContext);
    const neuronSelected = state.selectedId === root_id;
    const lineSelected = state.selectedId !== none_selected && state.selectedId !== root_id;

    return (
        <>
            <div className="SimulateCanvasTree" id={'Canvas'}>
                <TreeCanvas />
            </div>
            <div className="SimulateCanvasBottomPanel">
                <div className="SimulateCanvasBottomLeft">
                    <TreeTexts />
                </div>
                <div className="SimulateCanvasBottomRight">
                    {!neuronSelected && !lineSelected ? (
                        <div>Select a section to travel the tree</div>
                    ) : (
                        <div>{state.selectedId !== none_selected ? <TreeNavigation /> : null}</div>
                    )}
                </div>
            </div>
        </>
    );
};
export default SimulateCanvas;
