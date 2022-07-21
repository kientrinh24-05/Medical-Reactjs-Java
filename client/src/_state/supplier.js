import { atom } from 'recoil';

export const supplierAtom = atom({
    key: 'suppliers',
    default: {
        items:[],
        loaded:false
    }
});

