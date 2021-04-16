import { createContext } from 'react';
import { IAppState } from './Wrapper';

export const AppContext = createContext({
    state: {},
    setState: () => {
        null;
    },
} as { state: IAppState; setState: any });
