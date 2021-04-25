import { Dictionary } from '../Wrapper';

export const infoTitle: Dictionary<string> = {
    general: 'General properties for the whole simulation',
    sim_time: 'Simulation time [mS]',
    dt: 'Granularity of the time vector',
    rest_volt: 'Resting voltage [mV]',
    celsius: 'Celsius [℃]',
    hh: 'Hodgkin–Huxley model',
    minf_hh: 'm - activation gate of Na',
    mtau_hh: 'm - activation gate of Na',
    hinf_hh: 'h - deactivation gate of Na',
    htau_hh: 'h - deactivation gate of Na',
    ntau_hh: 'n - activation gate of K',
    ninf_hh: 'n - activation gate of K',
};

export const infoContent: Dictionary<string> = {
    general: '',
    sim_time: 'Total run time of the simulation',
    dt: 'lower value => higher Granularity',
    rest_volt: 'The resting membrane potential',
    celsius: '',
    hh: 'https://en.wikipedia.org/wiki/Hodgkin-Huxley_model',
    minf_hh: 'm∞: gating equation constant in steady state [mV]',
    ninf_hh: 'n∞: gating equation constant in steady state [mV]',
    hinf_hh: 'h∞: gating equation constant in steady state [mV]',
    mtau_hh: 'time constant [mS]',
    htau_hh: 'time constant [mS]',
    ntau_hh: 'time constant [mS]',
};

// relative path in public/assests
export const infoImg: Dictionary<string> = {
    hh: 'hh.jpg',
    minf_hh: 'm(t).jpg',
    mtau_hh: 'm(t).jpg',
    hinf_hh: 'h(t).jpg',
    htau_hh: 'h(t).jpg',
    ntau_hh: 'n(t).jpg',
    ninf_hh: 'n(t).jpg',
};
