import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { none_selected, ILine, root_id } from '../Wrapper';
import { useTreeCanvas } from './useTreeCanvas';

export function useTreeNavigation() {
    const { state } = useContext(AppContext);
    const { getChildren, setSelectedId } = useTreeCanvas();

    const setNextChildSelected = () => {
        if (state.selectedId === none_selected) return;

        let childs: ILine[];
        if (state.selectedId === root_id) {
            childs = getChildren(root_id);
        } else {
            const selectedLine = state.lines.find((line) => line.id === state.selectedId);
            childs = getChildren(selectedLine!.id);
        }

        if (childs.length === 0) return;

        setSelectedId(childs[0].id);
    };

    const setBackChildSelected = () => {
        if (state.selectedId === none_selected || state.selectedId === root_id) return;

        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
        setSelectedId(selectedLine!.pid);
    };

    const setBrotherChildSelected = () => {
        if (state.selectedId === none_selected || state.selectedId === root_id) return;

        const selectedLine = state.lines.find((line) => line.id === state.selectedId);
        const childs = getChildren(selectedLine!.pid);

        if (childs.length === 1) return;

        const nextIdx = childs.findIndex((l) => l.id === selectedLine!.id) + 1;
        const nextId = childs[nextIdx % childs.length].id;

        setSelectedId(nextId);
    };

    return {
        setNextChildSelected,
        setBackChildSelected,
        setBrotherChildSelected,
    };
}
