import {createContext} from 'react'
import { IAppState } from '../Wrapper';

export const AppContext = createContext({state: {}, setState: ()=>{}} as {state: IAppState, setState: any});