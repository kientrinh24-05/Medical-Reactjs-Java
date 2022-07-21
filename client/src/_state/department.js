import { atom } from 'recoil';

export const departmentAtom = atom({
    key: 'departments',
    default: {
        items:[],
        loaded:false
    }
});

