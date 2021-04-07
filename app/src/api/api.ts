import axios, { AxiosResponse } from 'axios';
import { IFormInput, init_form } from '../Wrapper';

export const run = async (setData: Function, setError: Function, inputs: IFormInput[]) => {
    const none_default_data = inputs
        .map((input) => {
            return { id: input.id, value: input.value };
        })
        .filter((input, index) => {
            return init_form[index].value !== input.value;
        });

    try {
        const response = (await axios.request({
            url: 'http://localhost:8080/api/v1/run',
            method: 'POST',
            data: none_default_data,
        })) as AxiosResponse;
        const t = response.data['time'] as number[];
        const v = response.data['volt'] as number[];
        const r = [];
        for (let i = 0; i < t.length; i++) r.push([t[i], v[i]]);
        setData(r);
    } catch (error: any) {
        setError('Simulation Failed');
    }
};
