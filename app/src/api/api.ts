import axios, { AxiosResponse } from 'axios';
import { IAttr, IPlotData, mpObj, SectionScheme } from '../Wrapper';
import readMocks from './readMock.json';

export interface schema {
    id: string;
    value: any;
}

export const getParamsJson = (globalMech: mpObj, sections: Record<string, SectionScheme>): schema[] => {
    const data: schema[] = [];
    data.push({ id: 'global', value: globalMech });
    data.push({ id: 'sections', value: sections });
    return data;
};

export const run = async (
    setData: Function,
    setError: Function,
    globalMech: mpObj,
    sections: Record<string, SectionScheme>,
) => {
    try {
        const response = (await axios.request({
            url: 'http://localhost:8080/api/v1/run',
            method: 'POST',
            data: getParamsJson(globalMech, sections),
        })) as AxiosResponse;

        const idata: IPlotData[] = [];
        for (const key in response.data) {
            idata.push({ name: key, plot: response.data[key] as number[] });
        }
        setData(idata);
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
