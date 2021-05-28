import React, { useState } from 'react';
import { AppContext } from './AppContext';
import config from '../src/config.json';
import { readSchema } from './api/api';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { brute_force_main } from './util/colors';

export interface Dictionary<T> {
    [Key: string]: T;
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

export const section_short_labels: Dictionary<string> = {
    0: 'undef',
    1: 'soma',
    2: 'axon',
    3: 'basal',
    4: 'apic',
    5: 'custom',
};

export const section_recording = ['volt', 'i_na', 'i_k'];

export type RenderILine = Pick<ILine, 'id' | 'pid' | 'points' | 'children' | 'tid' | 'radius'>;

export type SectionScheme = Omit<
    ISection,
    'mechanismCurrKey' | 'processCurrKey' | 'segmentCurrKey' | 'line' | 'generalChanged' | 'processCurrKeyCurrIdx'
>;

export type IAttr = Record<string, number>;
export interface IMechanismProcess {
    attrs: IAttr;
    add?: boolean;
}

export interface IBruteForceParam {
    min: number;
    max: number;
    amount: number;
}

export type IBruteAttr = Record<string, IBruteForceParam>;

export interface IBruteMechanism {
    attrs: IBruteAttr;
    add?: boolean;
}

export type impKeys = 'pointMechanism' | 'pointProcess' | 'globalMechanism';
export type singleAttrObj = Record<string, IMechanismProcess>;
export type mulAttrObj = Record<string, IMechanismProcess[]>;
export type singleBruteAttrObj = Record<string, IBruteMechanism>;

export interface ISection {
    id: string;
    mechanism: singleAttrObj;
    mechanismCurrKey: string;
    processCurrKey: string;
    process: Record<number, mulAttrObj>; //key: segment
    records: Record<number, number[]>; //key: segment
    segmentCurrKey: number;
    processCurrKeyCurrIdx: Record<string, number>;
    general: IAttr;
    generalChanged: boolean;
    line: RenderILine;
}

export interface IBruteSection {
    id: string;
    mechanism: singleBruteAttrObj;
    general: IBruteAttr;
    generalChanged: boolean;
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

export interface IDialogs {
    infoState: boolean;
    infoTitle: string;
    infoContent: string;
    infoImage?: string;
    exportState: boolean;
    bruteState: boolean;
}

export interface IPlotPayload {
    time: number[];
    volt: Record<string, number[]>;
    current: Record<string, number[]>;
}

export interface IAnimData {
    from: string;
    to: string;
    dur: number;
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
    pointMechanism: singleAttrObj;
    pointProcess: singleAttrObj;
    globalMechanism: singleAttrObj;
    globalMechanismCurrKey: string;
    plots: IPlotPayload[];
    addAnims: boolean;
    animations: Record<string, IAnimData[]>;
    bruteForceMode: boolean;
    theme: Partial<Theme>;
    bruteGlobalMechanism: singleBruteAttrObj;
    bruteSctions: Record<string, IBruteSection>;
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

export const defTheme = createMuiTheme();
export const bruteTheme = createMuiTheme({
    palette: {
        primary: {
            main: brute_force_main,
        },
    },
});

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
        infoState: false,
        infoTitle: '',
        infoContent: '',
        exportState: false,
        bruteState: false,
    },
    summaryState: false,
    pointMechanism: {},
    pointProcess: {},
    globalMechanism: static_global_form,
    globalMechanismCurrKey: init_global_curr_key,
    plots: [],
    addAnims: false,
    animations: {},
    bruteForceMode: false,
    theme: defTheme,
    bruteGlobalMechanism: {},
    bruteSctions: {},
};

const Wrapper = (props: any) => {
    const [state, setState] = useState<IAppState>(init_app_state);

    return <AppContext.Provider value={{ state, setState }}>{props.children}</AppContext.Provider>;
};

export default Wrapper;
