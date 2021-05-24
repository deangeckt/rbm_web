import { section_short_labels } from '../Wrapper';

export const sectionKeyToLabel = (sectionKey: string): string => {
    const keys = sectionKey.split('_');
    const cid = keys[0];
    const tid = keys[1];
    return `${section_short_labels[tid]}[${cid}]`;
};
