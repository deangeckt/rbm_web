import { useContext } from 'react';
import { AppContext } from '../AppContext';

export function useSimulate() {
    const { state, setState } = useContext(AppContext);

    return {};
}
