import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { importFile } from './utils/SwcUtils';
import './App.css';
import { AppContext } from './Contexts/AppContext';
import { init_app_state } from './Wrapper';

function App(): JSX.Element {
    const history = useHistory();
    const { state, setState } = useContext(AppContext);

    const uploadFile = async (e: any) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e?.target?.result;
            if (text) {
                const r = importFile(text as string, state.stage.rootX, state.stage.rootY);
                setState({ ...state, r });
                history.push({ pathname: '/design' });
            }
        };
        reader.readAsText(e?.target?.files[0]);
    };

    return (
        <div className="App">
            <div className="Container">
                <Button
                    className="Button"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        // TODO: bug -> from design getting back here & clicking new neuron doesnt reset state
                        setState({ ...state, init_app_state });
                        history.push({ pathname: '/design' });
                    }}
                >
                    New Neuron
                </Button>
                <div className="Divider" />
                <Button className="Button" variant="outlined" color="primary" component="label">
                    Import Neuron
                    <input type="file" accept={'.txt, .swc'} hidden onChange={(e) => uploadFile(e)} />
                </Button>
            </div>
        </div>
    );
}

export default App;
