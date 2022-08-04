import { atom } from 'recoil';

export const invoicesAtom = atom({
    key: 'invoices',
    default: {
        items:[],
        loaded:false
    }
});

