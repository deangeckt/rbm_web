import React, { useState } from 'react';
import { AppContext } from './AppContext';
import config from '../src/config.json';
import { readSchema } from './api/api';

export interface Dictionary<T> {
    [Key: string]: T;
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

export const section_recording = [
    {
        value: 0,
        label: 'none',
    },
    {
        value: 1,
        label: 'volt',
    },
    {
        value: 2,
        label: 'ina',
    },
    {
        value: 3,
        label: 'ik',
    },
];

export type RenderILine = Pick<ILine, 'id' | 'pid' | 'points' | 'children' | 'tid' | 'radius'>;
export type impKeys = 'pointMechanism' | 'pointProcess' | 'globalMechanism';
export type mpObj = Record<string, IMechanismProcess>;
export type SectionScheme = Omit<ISection, 'mechanismCurrKey' | 'processSectionCurrKey' | 'processCurrKey' | 'line'>;
export interface ISection {
    id: string;
    recording_type: number;
    mechanism: mpObj;
    mechanismCurrKey: string;
    process: Record<number, mpObj>; //key: segment
    processSectionCurrKey: number;
    processCurrKey: string;
    general: IAttr;
    line: RenderILine;
}

export interface RenderTreeText {
    id: string;
    children?: RenderTreeText[];
}

export interface ILine {
    id: string;
    pid: string;
    tid: number;
    cid?: number;
    points: number[]; // [x1, y1, x2,y2]
    radius: number;
    length: number;
    alpha: number;
    children: string[];
}

export type IAttr = Record<string, number>;
export interface IMechanismProcess {
    attrs: IAttr;
    add?: boolean;
}

export interface IDialogs {
    dialogState: boolean;
    dialogInfoTitle: string;
    dialogInfoContent: string;
    dialogInfoImage?: string;
}

export interface IPlotData {
    plot: number[];
    name: string;
}

// section key: cid_tid
// design line key: swc id
// simulate line key: cid_tid
export interface IAppState {
    stage: IStageSize;
    designLines: Record<string, ILine>;
    designLastAddedId: string;
    selectedId: string;
    sections: Record<string, ISection>;
    checkedSections: Record<string, boolean>;
    sectionsTreeText: RenderTreeText;
    dialogs: IDialogs;
    summaryState: boolean;
    pointMechanism: mpObj;
    pointProcess: mpObj;
    globalMechanism: mpObj;
    globalMechanismCurrKey: string;
    plots: IPlotData[][];
    addAnims: false;
}

export const getStage = (canvasId: string): IStageSize => {
    const canvas_part_size = 0.7;
    const canvas_hegiht = window.document.getElementById(canvasId)?.offsetHeight ?? window.innerHeight;
    const canvas_width = window.document.getElementById(canvasId)?.offsetWidth ?? window.innerWidth * canvas_part_size;
    return {
        width: canvas_width,
        height: canvas_hegiht,
        rootX: canvas_width / 2,
        rootY: canvas_hegiht / 2,
    };
};

export const root_id = '1';
export const none_selected_id = '-1';
export const root_key = '0_1';
export const none_selected_key = '-1';

export const default_neuron_rad = 3; // in micro
export const default_radius = 0.1; // in micro
export const default_tid = 0;
export const default_length = 10; //in micro
export const default_alpha = 0.1; // in rad [PI]
export const default_section_value = 0.5;

const init_stage = getStage('Canvas');
const static_global_form = readSchema(config.static_global_form);

export const init_general_section: IAttr = {
    L: 100,
    Ra: 35.4,
    nseg: 1,
    rallbranch: 1.0,
};

export const design_init_root_line: ILine = {
    id: root_id,
    pid: '-1',
    points: [-1, -1, init_stage.rootX, init_stage.rootY],
    children: [],
    tid: 1,
    radius: default_neuron_rad,
    length: 0,
    alpha: 0,
};

export const init_global_curr_key = 'general';

export const init_app_state: IAppState = {
    stage: init_stage,
    designLines: {
        1: design_init_root_line,
    },
    sections: {},
    checkedSections: {},
    sectionsTreeText: { id: root_key },
    selectedId: none_selected_id,
    designLastAddedId: root_id,
    dialogs: {
        dialogState: false,
        dialogInfoTitle: '',
        dialogInfoContent: '',
    },
    summaryState: false,
    pointMechanism: {},
    pointProcess: {},
    globalMechanism: static_global_form,
    globalMechanismCurrKey: init_global_curr_key,
    plots: [],
    addAnims: false,
};

const Wrapper = (props: any) => {
    const [state, setState] = useState<IAppState>(init_app_state);

    return <AppContext.Provider value={{ state, setState }}>{props.children}</AppContext.Provider>;
};

export default Wrapper;
