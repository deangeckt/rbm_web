import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { infoTitle, infoContent, infoImg } from '../../util/info';

export function useDialogs() {
    const { state, setState } = useContext(AppContext);

    const toggleExport = (val: boolean) => {
        const dialogs = { ...state.dialogs };
        dialogs.exportState = val;
        setState({ ...state, dialogs: dialogs });
    };

    const toggleBrute = (val: boolean, attr: string) => {
        const dialogs = { ...state.dialogs };
        dialogs.bruteState = val;
        setState({ ...state, dialogs: dialogs, bruteCurrAttr: attr });
    };

    const toggleBruteResults = (val: boolean) => {
        const dialogs = { ...state.dialogs };
        dialogs.bruteResultsShow = val;
        setState({ ...state, dialogs: dialogs });
    };

    const toggleBruteConsent = (val: boolean) => {
        const dialogs = { ...state.dialogs };
        dialogs.bruteConsent = val;
        setState({ ...state, dialogs: dialogs });
    };

    const closeInfo = () => {
        const dialogs = { ...state.dialogs };
        dialogs.infoContent = '';
        dialogs.infoState = false;
        dialogs.infoTitle = '';
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

    return { closeInfo, updateInfo, toggleExport, toggleBrute, toggleBruteResults, toggleBruteConsent };
}
