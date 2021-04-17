import React, { useContext } from 'react';
import { none_selected, root_id } from '../Wrapper';
import { AppContext } from '../AppContext';
import TreeCanvas from '../tree/TreeCanvas';
import TreeNavigation from '../tree/TreeNavigation';
import { useSimulate } from './useSimulate';
import './Simulate.css';

export interface ISimulateCanvasProps {
    setTab: (tab_id: number) => void;
}

const SimulateCanvas = ({ setTab }: ISimulateCanvasProps) => {
    const { state } = useContext(AppContext);
    const neuronSelected = state.selectedId === root_id;
    const lineSelected = state.selectedId !== none_selected && state.selectedId !== root_id;

    return (
        <>
            <div className="SimulateCanvasTree" id={'Canvas'}>
                <TreeCanvas />
            </div>
            <div className="SimulateCanvasBottomPanel">
                <div className="SimulateCanvasBottomLeft">Left</div>

                <div className="SimulateCanvasBottomRight">
                    {!neuronSelected && !lineSelected ? (
                        <div>Select a section</div>
                    ) : (
                        <div>{state.selectedId !== none_selected ? <TreeNavigation /> : null}</div>
                    )}
                </div>
            </div>
        </>
    );
};
export default SimulateCanvas;
