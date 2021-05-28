import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { IBruteSection, ISection } from '../../Wrapper';

export function useDynamicFormShare() {
    const { state, setState } = useContext(AppContext);

    const getFirstSelectedSection = (): ISection | undefined => {
        const selecedSections = Object.entries(state.checkedSections).filter(([, added]) => !!added);
        if (selecedSections.length === 0) return undefined;
        const sectionKey = selecedSections[0][0];
        return state.sections[sectionKey];
    };

    const getAllSelectedSections = (): ISection[] => {
        const selectedSections: ISection[] = [];
        const selectedKeys = Object.entries(state.checkedSections)
            .filter(([, added]) => added)
            .map(([key]) => key);
        selectedKeys.forEach((key) => selectedSections.push(state.sections[key]));
        return selectedSections;
    };

    const updateSelectedSectionsState = (selectedSections: ISection[]) => {
        const sections = { ...state.sections };
        selectedSections.forEach((sec) => (sections[sec.id] = sec));
        setState({ ...state, sections: sections });
    };

    return {
        getFirstSelectedSection,
        getAllSelectedSections,
        updateSelectedSectionsState,
    };
}
