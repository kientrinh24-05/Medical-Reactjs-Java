import { atom } from 'recoil';

export const warehouseAtom = atom({
    key: 'warehouses',
    default: {
        items:[],
        loaded:false
    }
});

