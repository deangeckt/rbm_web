import { useContext } from 'react';
import { AppContext } from '../../AppContext';

export function useDialogs() {
    const { state, setState } = useContext(AppContext);

    const setDialogInfo = (val: boolean) => {
        const dialogs = { ...state.dialogs };
        dialogs.dialogInfo = val;
        setState({ ...state, dialogs: dialogs });
    };
    return { setDialogInfo };
}
