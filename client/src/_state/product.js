import { atom } from 'recoil';

export const productAtom = atom({
    key: 'products',
    default: {
        items:[],
        total: 0,
        loaded:false
    }
});

