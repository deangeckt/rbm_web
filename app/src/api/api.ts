import axios, {AxiosError, AxiosResponse} from 'axios';

export const run = (setData: Function): void => {
    axios.request({
        url: 'http://localhost:8080/api/v1/run',
        method: 'POST',
        data: {bla: 'bla'}
    }).then((response: AxiosResponse) => {
            const t = response.data['time'] as number[];
            const v = response.data['volt'] as number[];
            const r = [];
            for (var i = 0 ; i<t.length; i++)
                r.push([t[i], v[i]]);
            setData(r);
    }).catch((error: AxiosError) => {
            console.error('err');
    });
}
