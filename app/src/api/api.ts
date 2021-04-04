import axios, { AxiosResponse } from 'axios';
import { IFormInput } from '../simulate/Simulate';

export const run = async (setData: Function, setError: Function, config: IFormInput[]) => {
    // TODO: create share (client + server) and pass only none default elements
    const data = config.map((element) => {
        return { id: element.id, value: element.value };
    });
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
        setError('Failed to start simulation');
    }
};
