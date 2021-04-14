import React, { useState } from 'react';
import { AppContext } from './Contexts/AppContext';
import config from '../src/share/config.json';

export interface ILine {
    id: number;
    cid?: number;
    tid: number;
    pid: number;
    points: number[]; // [x1,y1, x2,y2]
    radius: number;
    length: number;
    alpha: number;
}

export interface IStageSize {
    width: number;
    height: number;
    rootX: number;
    rootY: number;
}

export const section_types = [
    {
        value: 0,
        label: 'undefined',
    },
    {
        value: 1,
        label: 'soma',
    },
    {
        value: 2,
        label: 'axon',
    },
    {
        value: 3,
        label: 'basal dendrite',
    },
    {
        value: 4,
        label: 'apical dendrite',
    },
    {
        value: 5,
        label: 'custom',
    },
];

export const recording_types = ['volt', 'ina', 'ik'];

export interface ISection {
    type: number; // based on types
    id: number;
    section: number;
}

export interface IStimInput {
    delay: number;
    duration: number;
    amplitude: number;
    section: ISection;
}

export interface IRecordInput {
    section: ISection;
    type: string;
}
export interface IGlobalInput {
    name: string;
    value: any;
    tooltipTitle: string;
    id: string;
    group?: number;
    // TODO: add tooltip explained / forumla / image
}

export interface IDialogs {
    dialogInfo: boolean;
    dialogInfoTitle: string;
}

export interface IAppState {
    stage: IStageSize;
    lines: ILine[];
    neuronRadius: number;
    stims: IStimInput[];
    records: IRecordInput[];
    inputs: IGlobalInput[];
    selectedId: number;
    dialogs: IDialogs;
}

export const getStage = (): IStageSize => {
    //TODO: this is the css value of the partial width in design.tsx component, not simulation.tsx
    console.log('stage:', window.document.getElementById('Canvas')?.offsetWidth);
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
export const init_form = config.default_form as ReadonlyArray<IGlobalInput>;
export const root_id = 1;
export const none_selected = -1;
export const default_radius = 0.1; // in micro
export const default_tid = 0;
export const default_length = 10; //in micro
export const default_alpha = Math.PI * 0.1;

export const init_app_state: IAppState = {
    stage: getStage(),
    lines: [],
    stims: [],
    records: [],
    neuronRadius: default_neuron_rad,
    inputs: JSON.parse(JSON.stringify(init_form)) as IGlobalInput[],
    selectedId: none_selected,
    dialogs: {
        dialogInfo: false,
        dialogInfoTitle: '',
    },
};

const Wrapper = (props: any) => {
    const [state, setState] = useState<IAppState>(init_app_state);

    return <AppContext.Provider value={{ state, setState }}>{props.children}</AppContext.Provider>;
};

export default Wrapper;
