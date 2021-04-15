import { IMechanism } from '../Wrapper';

export const pointMechanismMock: IMechanism[] = [
    {
        mech: 'hh',
        attrs: [
            {
                attr: 'gnabar_hh',
                value: 0.12,
            },
            {
                attr: 'gkbar_hh',
                value: 0.036,
            },
            {
                attr: 'gl_hh',
                value: 0.0003,
            },
            {
                attr: 'el_hh',
                value: -54.3,
            },
        ],
    },
    {
        mech: 'Kdr',
        attrs: [
            {
                attr: 'gKdrbar_Kdr',
                value: 0.0338,
            },
        ],
    },
];

export const globalMechanismMock: IMechanism[] = [
    {
        mech: 'na_ion',
        attrs: [
            {
                attr: 'nai0_na_ion',
                value: 10.0,
            },
            {
                attr: 'nao0_na_ion',
                value: 140.0,
            },
        ],
    },
    {
        mech: 'k_ion',
        attrs: [
            {
                attr: 'ki0_k_ion',
                value: 54.4,
            },
            {
                attr: 'ko0_k_ion',
                value: 2.5,
            },
        ],
    },
];
