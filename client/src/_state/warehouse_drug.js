import { atom } from 'recoil';

export const warehousedrugAtom = atom({
    key: 'warehousedrug',
    default: {
        items:[],
        loaded:false
    }
});

