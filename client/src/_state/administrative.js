import { atom } from 'recoil';

export const administrativeAtom = atom({
    key: 'administratives',
    default: {
        items:[],
        loaded:false
    }
});

