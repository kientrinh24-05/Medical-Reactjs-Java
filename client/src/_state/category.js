import { atom } from 'recoil';

export const categoryAtom = atom({
    key: 'category',
    default: {
        items:[],
        total: 0,
        loaded:false
    }
});

