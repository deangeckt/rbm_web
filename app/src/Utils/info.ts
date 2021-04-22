import { Dictionary } from '../Wrapper';

export const infoTitle: Dictionary<string> = {
    general: 'General properties for the whole simulation',
    sim_time: 'Simulation time [mS]',
    dt: 'Granularity of the time vector',
    rest_volt: 'Resting voltage [mV]',
    celsius: 'Celsius [℃]',
};

export const infoContent: Dictionary<string> = {
    general: '',
    sim_time: 'Total run time of the simulation',
    dt: 'lower value => higher Granularity',
    rest_volt: 'The resting membrane potential',
    celsius: '',
};
