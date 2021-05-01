import { useContext } from 'react';
import { AppContext } from '../AppContext';

export function useSimulate() {
    const { state } = useContext(AppContext);

    const getParamsForRun = () => {
        const globalMech = { ...state.globalMechanism };
        const globalMechanism = Object.entries(globalMech).filter(([, mech]) => mech.add);
        const sections = { ...state.sections };
        return { globalMechanism, sections };
    };

    return { getParamsForRun };
}
