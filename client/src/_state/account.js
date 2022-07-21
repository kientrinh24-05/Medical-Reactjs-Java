import { atom, selector, selectorFamily } from 'recoil';

const accountAtom = atom({
    key: 'account',
    default: {
        permissions: []
    }
});

const accountCaps = selector({
    key: "accountCaps",
    get: ({ get }) => {
        const account = get(accountAtom);
        return account.permissions;
    }
})

const userCan = selectorFamily({
    key: "userCan",
    get: (cap) => ({ get }) => {
        const caps = get(accountCaps);
        return caps.includes(cap);
    }
})

export { accountAtom, userCan, accountCaps };