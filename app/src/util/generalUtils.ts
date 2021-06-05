import { makeStyles, Theme, createStyles, createMuiTheme } from '@material-ui/core';
import { section_short_labels } from '../Wrapper';
import { brute_force_main } from './colors';

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

export const bruteTheme = createMuiTheme({
    palette: {
        primary: {
            main: brute_force_main,
        },
    },
});
