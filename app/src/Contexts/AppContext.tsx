import {createContext} from 'react'
import { AppState } from '../Wrapper';

export const AppContext = createContext({state: {}, setState: ()=>{}} as {state: AppState, setState: any});