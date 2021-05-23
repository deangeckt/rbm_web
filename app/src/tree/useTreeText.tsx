import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { ISection, RenderTreeText, root_key } from '../Wrapper';

export function useTreeText() {
    const { state, setState } = useContext(AppContext);

    const getTreeChildrenRecur = (sectionKey: string, res: string[]) => {
        const currSection = state.sections[sectionKey];
        if (!currSection) return;
        const childs = currSection.line.children;
        for (let i = 0; i < childs.length; i++) {
            const child = childs[i];
            res.push(child);
            getTreeChildrenRecur(child, res);
        }
    };

    const setMultipleSectionChecked = (sectionKey: string) => {
        const treeRes: string[] = [sectionKey];
        getTreeChildrenRecur(sectionKey, treeRes);
        toggleSectionCheck(treeRes);
    };

    const toggleSectionCheck = (sectionsKeys: string[]) => {
        const selectedSecs = { ...state.checkedSections };

        sectionsKeys.forEach((sectionKey) => {
            const isChecked = selectedSecs[sectionKey];
            selectedSecs[sectionKey] = !isChecked;
        });

        setState({ ...state, checkedSections: selectedSecs });
    };

    const setSectionChecked = (sectionKey: string) => {
        toggleSectionCheck([sectionKey]);
    };

    const isSectionChecked = (sectionKey: string): boolean => {
        return state.checkedSections[sectionKey] ?? false;
    };

    const sectionsToTreeRenderRecur = (
        tree: RenderTreeText,
        section: ISection,
        sections: Record<string, ISection>,
    ): void => {
        const childs = section.line.children;
        if (childs.length === 0) return;
        tree.children = [];
        for (let i = 0; i < childs.length; i++) {
            const newNode: RenderTreeText = { id: childs[i] };
            tree.children?.push(newNode);
            sectionsToTreeRenderRecur(newNode, sections[childs[i]], sections);
        }
    };

    const sectionsToTreeRender = (sections: Record<string, ISection>): RenderTreeText => {
        const res: RenderTreeText = { id: root_key };
        const root_sec = sections[root_key];
        sectionsToTreeRenderRecur(res, root_sec, sections);
        return res;
    };

    return {
        isSectionChecked,
        setSectionChecked,
        setMultipleSectionChecked,
        sectionsToTreeRender,
        getTreeChildrenRecur,
    };
}
