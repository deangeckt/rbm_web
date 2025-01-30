import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContext } from './AppContext';
import { init_app_state } from './Wrapper';
import { importFile } from './util/swcUtils';
import { Alert, Button, Snackbar } from '@mui/material';
import './App.css';

function App(): JSX.Element {
    const navigate = useNavigate();
    const { state, setState } = useContext(AppContext);
    const [error, setError] = React.useState('');

    const closeError = (_event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setError('');
    };

    const uploadSwcFile = async (e: any) => {
        if (e?.target?.files?.length === 0) return;
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e: any) => {
            const text = e?.target?.result;
            if (text) {
                try {
                    const r = importFile(text as string, state.stage.rootX, state.stage.rootY);
                    setState({ ...state, ...r });
                    navigate({ pathname: '/design' });
                } catch (e) {
                    setError((e as Error).message);
                }
            }
        };
        reader.readAsText(e?.target?.files[0]);
    };

    return (
        <div className="App">
            <Snackbar open={error !== ''} autoHideDuration={6000}>
                <Alert variant="outlined" severity="error" onClose={closeError}>
                    {error}
                </Alert>
            </Snackbar>
            <div className="Container">
                <Button
                    className="Button"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        setState({ ...state, ...init_app_state });
                        navigate({ pathname: '/design' });
                    }}
                >
                    New Neuron
                </Button>
                <div className="Divider" />
                <Button className="Button" variant="outlined" color="primary" component="label">
                    Import Neuron
                    <input type="file" accept={'.txt, .swc'} hidden onChange={(e) => uploadSwcFile(e)} />
                </Button>
            </div>
        </div>
    );
}

export default App;
