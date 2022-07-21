import { atom, selector } from 'recoil';

const attachmentsAtom = atom({
    key: 'attachments',
    default: {
        loaded: false,
        items: []
    }
});

//selector items
const attachmentItems = selector({
    key: 'attachmentItems',
    get: ({ get }) => {
        const attachments = get(attachmentsAtom);
        return attachments.items;
    },
    set: ({ set, get }, newValue) => {
        return set(attachmentsAtom, {
            ...get(attachmentsAtom),
            items: [...newValue]
        });
    }
});

const attachmentCategoryAtom = atom({
    key: 'attachmentCategory',
    default: []
})


const attachmentCategoryNested = selector({
    key: 'attachmentcategoryNested',
    get: ({ get }) => {
        const attachments = get(attachmentCategoryAtom);

        const arr = [...attachments.map(item => ({
            ...item,
            key:item.id,
            title:item.name,
            children: []
        }))];
        const arrMap = arr.reduce((acc, el, i) => {
            acc[el.id] = i;
            return acc;
        }, {});

        const roots = [];

        // Push each element to parent's children array
        arr.forEach(el => {
            if (!el.parent_id) {
                roots.push(el);
            } else {
                arr[arrMap[el.parent_id]].children.push(el);
            }
        });
        return roots;

    },
})



export {
    attachmentsAtom,
    attachmentItems,
    attachmentCategoryNested,
    attachmentCategoryAtom
};

