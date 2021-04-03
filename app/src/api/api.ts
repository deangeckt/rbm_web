import axios, {AxiosError, AxiosResponse} from 'axios';

export const run = (): number[][] => {
    axios.post('http://localhost:8080/api/v1/run')
        .then((response: AxiosResponse) => {
            const t = response.data['time'] as number[];
            const v = response.data['volt'] as number[];
            const r = [];
            for (var i = 0 ; i<t.length; i++)
                r.push([ t[i], v[i]]);
            console.log(r);
            return r;
        }).catch((error: AxiosError) => {
            console.log('err');
        });
    return [[]];
}
