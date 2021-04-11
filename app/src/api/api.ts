import axios, { AxiosResponse } from 'axios';
import { IFormInput, init_form, IStimInput } from '../Wrapper';

export const run = async (setData: Function, setError: Function, form: IFormInput[], stim: IStimInput[]) => {
    let data: { id: string; value: any }[] = [];
    const none_default_form = form
        .map((input) => {
            return { id: input.id, value: input.value };
        })
        .filter((input, index) => {
            return init_form[index].value !== input.value;
        });

    data.push({ id: 'swc_path', value: 'C:/Users/t-deangeckt/Downloads/swcTree.swc' });
    data.push({ id: 'stim', value: stim });
    data = data.concat(none_default_form);
    try {
        const response = (await axios.request({
            url: 'http://localhost:8080/api/v1/run',
            method: 'POST',
            data: data,
        })) as AxiosResponse;
        const t = response.data['time'] as number[];
        const v = response.data['volt'] as number[];
        const r = [];
        for (let i = 0; i < t.length; i++) r.push([t[i], v[i]]);
        setData(r);
    } catch (error: any) {
        console.log(error.response);
        setError('Simulation Failed ' + error.response.data);
    }
};
