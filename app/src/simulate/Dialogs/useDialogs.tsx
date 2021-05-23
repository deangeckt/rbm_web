import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { infoTitle, infoContent, infoImg } from '../../utils/info';

export function useDialogs() {
    const { state, setState } = useContext(AppContext);

    const closeInfo = () => {
        setState({ ...state, dialogs: { infoState: false, infoTitle: '', infoContent: '' } });
    };

    const toggleExport = (val: boolean) => {
        const dialogs = { ...state.dialogs };
        dialogs.exportState = val;
        setState({ ...state, dialogs: dialogs });
    };

    const updateInfo = (key: string) => {
        const dialogs = { ...state.dialogs };
        const title = infoTitle[key];
        if (!title) return;
        const content = infoContent[key];
        const img = infoImg[key];

        dialogs.infoTitle = title;
        dialogs.infoContent = content;
        dialogs.infoImage = img;
        dialogs.infoState = true;
        setState({ ...state, dialogs: dialogs });
    };

    return { closeInfo, updateInfo, toggleExport };
}
