import { atom } from 'recoil';

const employeAtom = atom({
    key: 'users',
    default: {
        loaded: false,
        items: []
    }
});

export {
    employeAtom,
};