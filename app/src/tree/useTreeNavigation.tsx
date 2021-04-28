import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { none_selected, root_id } from '../Wrapper';
import { useTreeCanvas } from './useTreeCanvas';

export function useTreeNavigation() {
    const { state } = useContext(AppContext);
    const { setSelectedId } = useTreeCanvas();

    const setNextChildSelected = () => {
        if (state.selectedId === none_selected) return;

        const childs = state.designLines[state.selectedId].lineChilds;
        if (childs.length === 0) return;
        setSelectedId(childs[0]);
    };

    const setBackChildSelected = () => {
        if (state.selectedId === none_selected || state.selectedId === root_id) return;
        const selectedLine = state.designLines[state.selectedId];
        setSelectedId(selectedLine.pid);
    };

    const setBrotherChildSelected = () => {
        if (state.selectedId === none_selected || state.selectedId === root_id) return;

        const selectedLine = state.designLines[state.selectedId];
        const sibs = state.designLines[selectedLine.pid].lineChilds;

        if (sibs.length === 1) return;

        const nextIdx = sibs.findIndex((l) => l === selectedLine.id) + 1;
        const nextId = sibs[nextIdx % sibs.length];

        setSelectedId(nextId);
    };

    return {
        setNextChildSelected,
        setBackChildSelected,
        setBrotherChildSelected,
    };
}
