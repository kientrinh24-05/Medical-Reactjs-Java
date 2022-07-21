import { atom } from 'recoil';

export const drugsAtom = atom({
    key: 'drugs',
    default: {
        items:[],
        loaded:false
    }
});

