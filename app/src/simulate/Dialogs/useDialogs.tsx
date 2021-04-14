import { useContext } from 'react';
import { AppContext } from '../../Contexts/AppContext';

export function useDialogs() {
    const { state, setState } = useContext(AppContext);

    const updateDialogInfo = (id: string) => {
        const currInput = state.inputs.find((ele) => ele.id === id);
        if (!currInput) return;

        const title = currInput.tooltipTitle;
        const dialogs = { ...state.dialogs };
        dialogs.dialogInfoTitle = title;
        dialogs.dialogInfo = true;
        setState({ ...state, dialogs: dialogs });
    };

    const setDialogInfo = (val: boolean) => {
        const dialogs = { ...state.dialogs };
        dialogs.dialogInfo = val;
        setState({ ...state, dialogs: dialogs });
    };

    return { updateDialogInfo, setDialogInfo };
}
