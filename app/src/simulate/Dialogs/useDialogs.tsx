import { useContext } from 'react';
import { AppContext } from '../../Contexts/AppContext';

export function useDialogs() {
    const { state, setState } = useContext(AppContext);

    const updateDialogInfo = (id: string) => {
        const currInput = state.inputs.find((ele) => ele.id === id);
        if (!currInput) return;

        const title = currInput.tooltipTitle;
        setDialogInfoTitle(title);
        setDialogInfo(true);
    };

    // TODO: make those 1 liner
    const setDialogInfoTitle = (title: string) => {
        const dialogs = { ...state.dialogs };
        dialogs.dialogInfoTitle = title;
        setState({ ...state, dialogs: dialogs });
    };

    const setDialogInfo = (val: boolean) => {
        const dialogs = { ...state.dialogs };
        dialogs.dialogInfo = val;
        setState({ ...state, dialogs: dialogs });
    };

    const setDialogNewForm = (val: boolean) => {
        const dialogs = { ...state.dialogs };
        dialogs.dialogNewForm = val;
        setState({ ...state, dialogs: dialogs });
    };

    return { updateDialogInfo, setDialogInfo, setDialogInfoTitle, setDialogNewForm };
}
