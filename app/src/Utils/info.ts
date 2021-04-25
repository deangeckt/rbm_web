import { Dictionary } from '../Wrapper';

export const infoTitle: Dictionary<string> = {
    general: 'General properties for the whole simulation',
    sim_time: 'Simulation time [mS]',
    dt: 'Granularity of the time vector',
    rest_volt: 'Resting voltage [mV]',
    celsius: 'Celsius [℃]',
    hh: 'Hodgkin–Huxley model',
    minf_hh: 'm - The sodium activation state variable',
    mtau_hh: 'm - The sodium activation state variable',
    hinf_hh: 'h - The sodium inactivation state variable',
    htau_hh: 'h - The sodium inactivation state variable',
    ntau_hh: 'n - The potassium activation state variable',
    ninf_hh: 'n - The potassium activation state variable',
    gnabar_hh: 'gna - Sodium channel conductance',
    gkbar_hh: 'gk - Potassium channel conductance',
    gl_hh: 'gl - Leakage conductance',
    el_hh: 'The reversal potential for the leakage channel [mV]',
    ena: 'The reversal potential for the sodium channel [mV]',
    ek: 'The reversal potential for the potassium  channel [mV]',
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
    gnabar_hh: 'The maximum specific sodium channel conductance [S/cm2]',
    gkbar_hh: 'The maximum specific potassium channel conductance [S/cm2]',
    gl_hh: 'The maximum specific leakage conductance [S/cm2]',
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
    gnabar_hh: 'hh_short.jpg',
    gkbar_hh: 'hh_short.jpg',
    gl_hh: 'hh_short.jpg',
};
