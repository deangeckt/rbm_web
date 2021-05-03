import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { infoTitle, infoContent, infoImg } from '../../utils/info';

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
        const img = infoImg[key];

        dialogs.dialogInfoTitle = title;
        dialogs.dialogInfoContent = content;
        dialogs.dialogInfoImage = img;
        dialogs.dialogState = true;
        setState({ ...state, dialogs: dialogs });
    };

    return { closeDialog, updateKeyInfo };
}
