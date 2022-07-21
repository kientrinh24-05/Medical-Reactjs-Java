import { atom } from 'recoil';

export const patientAtom = atom({
    key: 'patients',
    default: {
        items:[],
        loaded:false
    }
});

