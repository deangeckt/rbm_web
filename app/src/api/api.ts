/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import axios, { AxiosResponse } from 'axios';
import {
    IAnimData,
    IAttr,
    singleAttrObj,
    SectionScheme,
    IPlotPayload,
    singleBruteAttrObj,
    SectionBruteScheme,
    IBruteResult,
} from '../Wrapper';
import readMocks from './readMock.json';

const baseUrl = 'http://localhost:8080/api/v1/';

export interface schema {
    id: string;
    value: any;
}

export const prepareJsonParams = (globalMech: singleAttrObj, sections: Record<string, SectionScheme>): schema[] => {
    const data: schema[] = [];
    data.push({ id: 'global', value: globalMech });
    data.push({ id: 'sections', value: sections });
    return data;
};

export const parseJsonParams = (
    txt: string,
): { globalMechanism: singleAttrObj; sections: Record<string, SectionScheme> } => {
    const parsed = JSON.parse(txt) as schema[];
    let globalMechanism: singleAttrObj = {};
    let sections: Record<string, SectionScheme> = {};
    parsed.forEach((s) => {
        if (s.id === 'global') {
            globalMechanism = s.value;
        } else if (s.id === 'sections') {
            sections = s.value;
        }
    });
    return { sections, globalMechanism };
};

const readPlotPayload = (data: any): IPlotPayload => {
    const plotData: IPlotPayload = {
        time: [],
        volt: {},
        current: {},
    };
    Object.entries(data).forEach(([key, props]) => {
        if (key === 'time') {
            plotData.time = props as number[];
        } else if (key === 'volt') {
            Object.entries(props as any).forEach(([name, payload]) => {
                plotData.volt[name] = payload as number[];
            });
        } else if (key === 'current') {
            Object.entries(props as any).forEach(([name, payload]) => {
                plotData.current[name] = payload as number[];
            });
        }
    });

    return plotData;
};

export const run = async (
    setData: Function,
    setError: Function,
    globalMech: singleAttrObj,
    sections: Record<string, SectionScheme>,
    anim: boolean,
) => {
    try {
        const data = prepareJsonParams(globalMech, sections);
        if (anim) data.push({ id: 'animation', value: true });
        const response = (await axios.request({
            url: baseUrl + 'run',
            method: 'POST',
            data: data,
        })) as AxiosResponse;

        const animData: Record<string, IAnimData[]> = {};
        for (const key in response.data) {
            if (key === 'animation') {
                Object.entries(response.data['animation']).forEach(([sec_key, props]) => {
                    animData[sec_key] = props as IAnimData[];
                });
            }
        }
        setData(readPlotPayload(response.data['plot']), animData);
    } catch (error: any) {
        console.error(error);
        const msg = !error.response ? '' : error.response.data;
        setError('Simulation Failed ' + msg);
    }
};

export const readSchema = (data: any): singleAttrObj => {
    const result: singleAttrObj = {};
    Object.keys(data).forEach(function (attrKey) {
        const attrList = data[attrKey];
        const attrs: IAttr = {};

        attrList.forEach(function (attr: any) {
            attrs[Object.keys(attr)[0]] = Number(Object.values(attr)[0]);
        });

        result[attrKey] = {
            attrs: attrs,
            add: false,
        };
    });
    return result;
};

export const read = async (setError: Function, setData: Function) => {
    try {
        const response = (await axios.request({
            url: baseUrl + 'read',
            method: 'GET',
        })) as AxiosResponse;

        const section_general: Record<string, IAttr> = {};
        Object.entries(response.data['section_general']).forEach(([sec_key, props]) => {
            section_general[sec_key] = props as IAttr;
        });
        setData(
            readSchema(response.data['point_mechanism']),
            readSchema(response.data['global_mechanism']),
            readSchema(response.data['point_processes']),
            section_general,
        );
    } catch (error: any) {
        let msg;
        if (!error.response) {
            msg = ' - Using mocks';
            const section_general: Record<string, IAttr> = {};
            Object.entries(readMocks.section_general).forEach(([sec_key, props]) => {
                section_general[sec_key] = props as IAttr;
            });
            setData(
                readSchema(readMocks.point_mechanism),
                readSchema(readMocks.global_mechanism),
                readSchema(readMocks.point_processes),
                section_general,
            );
        } else msg = error.response.data;
        setError('Failed to read Neuron attributes ' + msg);
    }
};

export const bruteForce = async (
    setData: Function,
    setError: Function,
    globalMech: singleAttrObj,
    sections: Record<string, SectionScheme>,
    bruteGlobalMech: singleBruteAttrObj,
    bruteSections: Record<string, SectionBruteScheme>,
    plot: number[],
) => {
    try {
        const data = prepareJsonParams(globalMech, sections);
        const brute_params = { global: bruteGlobalMech, sections: bruteSections, plot: plot };
        data.push({ id: 'brute_force', value: brute_params });

        const response = (await axios.request({
            url: baseUrl + 'brute_force',
            method: 'POST',
            data: data,
        })) as AxiosResponse;

        const res: IBruteResult[] = [];
        Object.entries(response.data).forEach(([, props]) => {
            const plotData: IPlotPayload = {
                time: [],
                volt: {},
                current: {},
            };
            const res_obj: IBruteResult = { plot: plotData, sections: {}, global: {}, score: 0 };
            Object.entries(props as any).forEach(([key, props_res]) => {
                if (key === 'global') {
                    res_obj.global = props_res as singleAttrObj;
                } else if (key === 'plot') {
                    res_obj.plot = readPlotPayload(props_res);
                } else if (key === 'score') {
                    res_obj.score = props_res as number;
                } else if (key === 'sections') {
                    Object.entries(props_res as any).forEach(([sec_key, sec]) => {
                        res_obj.sections[sec_key] = sec as SectionScheme;
                        res_obj.sections[sec_key].process = {};
                        res_obj.sections[sec_key].records = {};
                    });
                }
            });
            res.push(res_obj);
        });
        setData(res);
    } catch (error: any) {
        console.error(error);
        const msg = !error.response ? '' : error.response.data;
        setError('Brute Force Failed ' + msg);
    }
};
