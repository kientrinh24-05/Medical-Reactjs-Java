import { atom, selector } from 'recoil';

const rolesAtom = atom({
    key: 'roles',
    default: {
        items: [],
        loaded: false
    }
});

const permissionAtom = atom({
    key: 'permissions',
    default: []
});

const roleNestedAtom = selector({
    key: 'roleNested',
    get: ({ get }) => {
        const roles = get(rolesAtom);

        //deep nested mutiple level rolesAtom items by parent_id
        const nestedRoles = roles.items.reduce((acc, cur) => {
            if (cur.parent_id) {
                const parent = acc.find(x => x.id == cur.parent_id);
                if (parent) {
                    parent.children = parent.children || [];
                    parent.children.push(cur);
                }
            } else {
                acc.push(cur);
            }
            return acc;
        }, []);



        return roles.items.reduce((acc, item) => {
            acc.set(item.id, item)
            

            const parent = item.parent_id === null
                ? acc.get('root')
                : (acc.get(item.parent_id).children ??= [])

            parent.push(item)

            return acc
        }, new Map([['root', []]])).get('root')

    }
});

export {
    rolesAtom,
    permissionAtom,
    roleNestedAtom
};

