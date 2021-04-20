import axios, { AxiosResponse } from 'axios';
import { IPlotData } from '../simulate/Simulate';
import { IMechanismProcess, IAttr } from '../Wrapper';
import readMocks from './readMock.json';

export const run = async (setData: Function, setError: Function) => {
    try {
        const response = (await axios.request({
            url: 'http://localhost:8080/api/v1/run',
            method: 'POST',
            data: {},
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

export const readSchema = (data: any): Record<string, IMechanismProcess> => {
    const result: Record<string, IMechanismProcess> = {};
    Object.keys(data).forEach(function (attrKey) {
        const attrList = data[attrKey];
        const attrs: IAttr[] = [];

        attrList.forEach(function (attr: any) {
            attrs.push({ attr: Object.keys(attr)[0], value: Number(Object.values(attr)[0]) });
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
