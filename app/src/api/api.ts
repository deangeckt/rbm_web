import axios, { AxiosResponse } from 'axios';

export const run = async (setData: Function, setError: Function) => {
    try {
        const response = (await axios.request({
            url: 'http://localhost:8080/api/v1/run',
            method: 'POST',
            data: { bla: 'bla' },
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
