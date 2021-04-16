import { IMechanismProcess } from '../Wrapper';

export const pointMechanismMock: IMechanismProcess[] = [
    {
        key: 'hh',
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
        key: 'Kdr',
        attrs: [
            {
                attr: 'gKdrbar_Kdr',
                value: 0.0338,
            },
        ],
    },
];

export const pointProcessMock: IMechanismProcess[] = [
    {
        key: 'IClamp',
        attrs: [
            {
                attr: 'delay',
                value: 0,
            },
            {
                attr: 'dur',
                value: 0,
            },
            {
                attr: 'amp',
                value: 0,
            },
            {
                attr: 'i',
                value: 0,
            },
        ],
    },
    {
        key: 'glutamate',
        attrs: [
            {
                attr: 'gmax',
                value: 0,
            },
            {
                attr: 'e',
                value: 0,
            },
        ],
    },
];

export const globalMechanismMock: IMechanismProcess[] = [
    {
        key: 'na_ion',
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
        key: 'k_ion',
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
