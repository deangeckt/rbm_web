import axios, { AxiosResponse } from 'axios';
import { IData } from '../simulate/Simulate';
import { IGlobalInput, init_form, IRecordInput, IStimInput } from '../Wrapper';

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

        const idata: IData[] = [];
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

export const read = async (setError: Function) => {
    try {
        const response = (await axios.request({
            url: 'http://localhost:8080/api/v1/read',
            method: 'GET',
        })) as AxiosResponse;
        // const point_processes = response.data['point_processes'];
        // const point_mechanism = response.data['point_mechanism'];
        // const global_mechanism = response.data['global_mechanism'];
    } catch (error: any) {
        console.error(error);
        const msg = !error.response ? '' : error.response.data;
        setError('Failed to read Neuron attributes ' + msg);
    }
};
