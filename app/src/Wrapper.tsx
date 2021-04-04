import React, { useState } from 'react';
import { AppContext } from './Contexts/AppContext';

export interface ILine {
    id: number;
    tid: number;
    points: number[]; // [x1,y1, x2,y2]
    radius: number;
    pid: number;
    length: number;
    alpha: number;
}

export interface IStageSize {
    width: number;
    height: number;
    rootX: number;
    rootY: number;
}

export interface IAppState {
    stage: IStageSize;
    lines: ILine[];
    neuronRadius: number;
}

export const getStage = (): IStageSize => {
    //TODO: this is the css value of the partial width in design.tsx component, not simulation.tsx
    const canvas_part_size = 0.7;
    const canvas_hegiht = window.document.getElementById('Canvas')?.offsetHeight ?? window.innerHeight;
    const canvas_width = window.document.getElementById('Canvas')?.offsetWidth ?? window.innerWidth * canvas_part_size;
    return {
        width: canvas_width,
        height: canvas_hegiht,
        rootX: canvas_width / 2,
        rootY: canvas_hegiht / 2,
    };
};

export const default_neuron_rad = 5; // in micro

export const init_app_state: IAppState = {
    stage: getStage(),
    lines: [],
    neuronRadius: default_neuron_rad,
};

const Wrapper = (props: any) => {
    const [state, setState] = useState<IAppState>(init_app_state);

    return <AppContext.Provider value={{ state, setState }}>{props.children}</AppContext.Provider>;
};

export default Wrapper;
