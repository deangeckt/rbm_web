import axios, { AxiosResponse } from 'axios';
import { IPlotData } from '../simulate/Simulate';
import { IGlobalInput, init_form, IMechanismProcess, IRecordInput, IStimInput, IAttr } from '../Wrapper';
import readMocks from './readMock.json';

export const run = async (
    setData: Function,
    setError: Function,
    form: IGlobalInput[],
    stim: IStimInput[],
    records: IRecordInput[],
) => {
    let data: { id: string; value: any }[] = [];
    const none_default_form = form
        .map((input) => {
            return { id: input.id, value: input.value };
        })
        .filter((input, index) => {
            return init_form[index].value !== input.value;
        });

    data.push({ id: 'stim', value: stim });
    data.push({ id: 'record', value: records });
    data = data.concat(none_default_form);
    try {
        const response = (await axios.request({
            url: 'http://localhost:8080/api/v1/run',
            method: 'POST',
            data: data,
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

const readSchema = (data: any): IMechanismProcess[] => {
    const result: IMechanismProcess[] = [];
    Object.keys(data).forEach(function (attrKey) {
        const attrList = data[attrKey];
        const attrs: IAttr[] = [];

        attrList.forEach(function (attr: any) {
            attrs.push({ attr: Object.keys(attr)[0], value: Number(Object.values(attr)[0]) });
        });

        result.push({
            key: attrKey,
            attrs: attrs,
            add: false,
        });
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
