import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { none_selected_key, root_key } from '../Wrapper';
import { useSimulateCanvas } from './useSimulateCanvas';

export function useSimulateTreeNavigation() {
    const { state } = useContext(AppContext);
    const { setSelectedId } = useSimulateCanvas();

    const setNextChildSelected = () => {
        if (state.selectedId === none_selected_key) return;

        const childs = state.sections[state.selectedId].children;
        if (childs.length === 0) return;
        setSelectedId(childs[0]);
    };

    const setBackChildSelected = () => {
        if (state.selectedId === none_selected_key || state.selectedId === root_key) return;
        const selected = state.sections[state.selectedId];
        setSelectedId(selected.pidKey);
    };

    const setBrotherChildSelected = () => {
        if (state.selectedId === none_selected_key || state.selectedId === root_key) return;

        const selected = state.sections[state.selectedId];
        const sibs = state.sections[selected.pidKey].children;

        if (sibs.length === 1) return;

        const nextIdx = sibs.findIndex((l) => l === selected.key) + 1;
        const nextId = sibs[nextIdx % sibs.length];

        setSelectedId(nextId);
    };

    return {
        setNextChildSelected,
        setBackChildSelected,
        setBrotherChildSelected,
    };
}
