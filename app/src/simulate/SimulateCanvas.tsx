import React, { useContext } from 'react';
import { none_selected, root_id } from '../Wrapper';
import { AppContext } from '../Contexts/AppContext';
import TreeCanvas from '../share/TreeCanvas';
import TreeNavigation from '../share/TreeNavigation';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';
import { record_tab, stim_tab } from './SimulateTabs';
import { useSimulate } from './useSimulate';

export interface ISimulateCanvasProps {
    setTab: (tab_id: number) => void;
}

const SimulateCanvas = ({ setTab }: ISimulateCanvasProps) => {
    const { state } = useContext(AppContext);
    const { addStim, addRecord, getSelectedCid } = useSimulate();
    const neuronSelected = state.selectedId === root_id;
    const lineSelected = state.selectedId !== none_selected && state.selectedId !== root_id;
    const selectedCid = getSelectedCid();
    // BUG - should be overflow hidden on .Simulate.css
    return (
        <>
            <div
                id={'Canvas'}
                style={{
                    width: '100%',
                    height: '100%',
                    borderBottom: '1px solid #efefef',
                    borderLeft: '1px solid #efefef',
                }}
            >
                <TreeCanvas />
            </div>
            <div style={{ flexBasis: '20%', minHeight: '20%', width: '100%' }}>
                {!neuronSelected && !lineSelected ? (
                    <big style={{ color: 'black', alignSelf: 'center', fontSize: '16px', marginTop: '16px' }}>
                        Select a section to add simulate properties
                    </big>
                ) : (
                    <>
                        <div>cid: {selectedCid} </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {state.selectedId !== none_selected ? <TreeNavigation /> : null}
                            <Button
                                className="NoCapsButton"
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setTab(stim_tab);
                                    addStim();
                                }}
                                startIcon={<AddIcon />}
                            >
                                Add New Stimulus
                            </Button>
                            <Button
                                className="NoCapsButton"
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setTab(record_tab);
                                    addRecord();
                                }}
                                startIcon={<AddIcon />}
                            >
                                Add New Recording
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default SimulateCanvas;
