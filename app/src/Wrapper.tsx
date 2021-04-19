import React, { useState } from 'react';
import { AppContext } from './AppContext';
import config from '../src/config.json';
import { readSchema } from './api/api';

export interface Dictionary<T> {
    [Key: string]: T;
}

export interface ILine {
    id: number;
    cid?: number;
    tid: number;
    pid: number;
    points: number[]; // [x1,y1, x2,y2]
    radius: number;
    length: number;
    alpha: number;
    lineChilds: number[];
}

export interface IStageSize {
    width: number;
    height: number;
    rootX: number;
    rootY: number;
}

export const section_short_labels: Dictionary<string> = {
    0: 'undef',
    1: 'soma',
    2: 'axon',
    3: 'basal',
    4: 'apic',
    5: 'custom',
};

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

export type Recording = 'none' | 'volt' | 'ina' | 'ik';

export interface ISection {
    key: string;
    section: number;
    depth: number;
    recording: Recording;
    added: boolean;
    mechanism: IMechanismProcess[];
    process: IMechanismProcess[];
    processKeyIdx: number;
    mechanismKeyIdx: number;
}

export interface IAttr {
    attr: string;
    value: number;
}

export interface IMechanismProcess {
    key: string;
    attrs: IAttr[];
    add?: boolean; // used only for global
}

export interface IDialogs {
    dialogInfo: boolean;
    dialogInfoTitle: string;
}

export type impKeys = 'pointMechanism' | 'pointProcess' | 'globalMechanism';
export interface IAppState {
    stage: IStageSize;
    lines: Record<string, ILine>; // key: swc id
    sectionLines: Record<string, ISection>; //key: cid_tid
    selectedSections: Record<string, boolean>; // key: cid_tid
    selectedId: number;
    lastId: number;
    dialogs: IDialogs;
    pointMechanism: IMechanismProcess[]; // to record?
    pointProcess: IMechanismProcess[];
    globalMechanism: IMechanismProcess[];
    globalMechanismCurrKeyIdx: number;
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
export const root_id = 1;
export const none_selected = -1;
export const default_radius = 0.1; // in micro
export const default_tid = 0;
export const default_length = 10; //in micro
export const default_alpha = 0.1; // in rad [PI]

const init_stage = getStage();
const static_global_form = readSchema(config.static_global_form);

export const init_root_line: ILine = {
    id: root_id,
    pid: -1,
    points: [-1, -1, init_stage.rootX, init_stage.rootY],
    lineChilds: [],
    tid: 1,
    radius: default_neuron_rad,
    length: 0,
    alpha: 0,
};
export const init_app_state: IAppState = {
    stage: init_stage,
    lines: {
        1: init_root_line,
    },
    sectionLines: {},
    selectedSections: {},
    selectedId: none_selected,
    lastId: root_id,
    dialogs: {
        dialogInfo: false,
        dialogInfoTitle: '',
    },
    pointMechanism: [],
    pointProcess: [],
    globalMechanism: static_global_form,
    globalMechanismCurrKeyIdx: 0,
};

const Wrapper = (props: any) => {
    const [state, setState] = useState<IAppState>(init_app_state);

    return <AppContext.Provider value={{ state, setState }}>{props.children}</AppContext.Provider>;
};

export default Wrapper;
