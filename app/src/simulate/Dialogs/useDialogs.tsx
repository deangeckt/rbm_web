import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { infoTitle, infoContent } from '../../utils/info';

export function useDialogs() {
    const { state, setState } = useContext(AppContext);

    const closeDialog = () => {
        setState({ ...state, dialogs: { dialogInfo: false, infoTitle: '', dialogInfoContent: '' } });
    };

    const updateKeyInfo = (key: string) => {
        const dialogs = { ...state.dialogs };
        const title = infoTitle[key];
        if (!title) return;
        const content = infoContent[key];

        dialogs.dialogInfoTitle = title;
        dialogs.dialogInfoContent = content;
        dialogs.dialogInfo = true;

        setState({ ...state, dialogs: dialogs });
    };

    return { closeDialog, updateKeyInfo };
}
