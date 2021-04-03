import React, { useState } from 'react'
import { AppContext } from './Contexts/AppContext'
import { default_neuron_rad } from './design/Design'

export interface ILine {
	id: number;
	tid: number;
	points: number[]; // [x1,y1, x2,y2]
	radius: number
	pid: number;
	length: number;
	alpha: number;
}
export interface IAppState {
    lines: ILine[],
    neuronRadius: number
}

export const init_app_state: IAppState = {
    lines: [],
    neuronRadius: default_neuron_rad
}

const Wrapper = (props: any) => {

	const [state, setState] = useState<IAppState>(init_app_state);

    return (
            <AppContext.Provider value={{state, setState}}>
                {props.children}
            </AppContext.Provider>
    )
}

export default Wrapper
