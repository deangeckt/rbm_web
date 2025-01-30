import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { section_short_labels } from '../Wrapper';
import { brute_force_main } from './colors';
import { createTheme } from '@material-ui/core/styles';

export const sectionKeyToLabel = (sectionKey: string): string => {
    const keys = sectionKey.split('_');
    const cid = keys[0];
    const tid = keys[1];
    return `${section_short_labels[tid]}[${cid}]`;
};

export const iconSizeStyle = { width: '30px', height: '30px' };

export const backDropStyle = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);

export const bruteTheme = createTheme({
    palette: {
        primary: {
            main: brute_force_main,
        },
    },
});
