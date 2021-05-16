import axios, { AxiosResponse } from 'axios';
import { IAnimData, IAttr, IPlotData, mpObj, SectionScheme } from '../Wrapper';
import readMocks from './readMock.json';

export interface schema {
    id: string;
    value: any;
}

export const prepareJsonParams = (globalMech: mpObj, sections: Record<string, SectionScheme>): schema[] => {
    const data: schema[] = [];
    data.push({ id: 'global', value: globalMech });
    data.push({ id: 'sections', value: sections });
    return data;
};

export const parseJsonParams = (txt: string): { globalMechanism: mpObj; sections: Record<string, SectionScheme> } => {
    const parsed = JSON.parse(txt) as schema[];
    let globalMechanism: mpObj = {};
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

export const run = async (
    setData: Function,
    setError: Function,
    globalMech: mpObj,
    sections: Record<string, SectionScheme>,
    anim: boolean,
) => {
    try {
        const data = prepareJsonParams(globalMech, sections);
        if (anim) data.push({ id: 'animation', value: true });
        const response = (await axios.request({
            url: 'http://localhost:8080/api/v1/run',
            method: 'POST',
            data: data,
        })) as AxiosResponse;

        const plotData: IPlotData[] = [];
        const animData: Record<string, IAnimData[]> = {};
        for (const key in response.data) {
            if (key === 'animation') {
                Object.entries(response.data['animation']).forEach(([sec_key, props]) => {
                    animData[sec_key] = props as IAnimData[];
                });
            } else {
                plotData.push({ name: key, plot: response.data[key] as number[] });
            }
        }
        setData(plotData, animData);
    } catch (error: any) {
        console.error(error);
        const msg = !error.response ? '' : error.response.data;
        setError('Simulation Failed ' + msg);
    }
};

export const readSchema = (data: any): mpObj => {
    const result: mpObj = {};
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
            url: 'http://localhost:8080/api/v1/read',
            method: 'GET',
        })) as AxiosResponse;

        setData(
            readSchema(response.data['point_mechanism']),
            readSchema(response.data['global_mechanism']),
            readSchema(response.data['point_processes']),
        );
    } catch (error: any) {
        let msg;
        if (!error.response) {
            msg = ' - Using mocks';
            setData(
                readSchema(readMocks.point_mechanism),
                readSchema(readMocks.global_mechanism),
                readSchema(readMocks.point_processes),
            );
        } else msg = error.response.data;
        setError('Failed to read Neuron attributes ' + msg);
    }
};
