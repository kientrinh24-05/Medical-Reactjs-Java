
import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { attachmentsAtom, attachmentCategoryAtom } from '@/_state';
export { useAttachmentActions };

function useAttachmentActions() {
    const setAttachments = useSetRecoilState(attachmentsAtom);
    const setCategories = useSetRecoilState(attachmentCategoryAtom);

    return {
        getList,
        destroy,
        upload,
        getFolderList,
        createFolder,
        updateFolder,
        destroyFolder
    }

    function getList(params) {
        return axios.get("/api/v1/categories", {
            params

        }).then(({ data }) => {
            setAttachments({
                items: data.data,
                loaded: true
            })
        });
    }
    function getFolderList(params) {
        return axios.get("/api/attachments/folders", {
            params

        }).then(({ data }) => {
            setCategories(
                data
            )
        });
    }

    function createFolder( data) {
        return axios.post(`/api/attachments/folders`, data).then(({ data }) => {
            setCategories(categories => {
                const newData = [...categories,data];
                return newData;
            })
        });
    }

    function updateFolder(id, data) {
        return axios.put(`/api/attachments/folders/${id}`, data).then(({ data }) => {
            setCategories(categories => {
                const newData = [...categories];
                const index = newData.findIndex(item => item.id === id);
                newData[index] = data;
                return newData;
            })
        });
    }

    function destroyFolder(id) {
        return axios.delete(`/api/attachments/folders/${id}`).then(({ data }) => {
            setCategories(categories => {
                const newData = [...categories];
                const index = newData.findIndex(item => item.id === id);
                newData.splice(index, 1);
                return newData;
            })
        });
    }
    function upload(formData, options, uid) {
        setAttachments((attachments) => ({
            ...attachments,
            items: [...attachments.items, {
                id: uid,
            }],
        }))
        return axios.post('/api/attachments', formData, {
            headers: { "content-type": "multipart/form-data" },
            ...options
        }).then(({ data }) => {

            setAttachments((attachments) => {
                let items = [...attachments.items]
                const index = items.findIndex(item => item.id === uid);
                if (index >= 0)
                    items[index] = data;
                else
                    items.push(data);
                return {
                    ...attachments,
                    items: [...items]
                }
            })
            return data;
        })
    }
    function destroy(id) {
        return axios.delete("/api/attachments/" + id).then(x => {
            setAttachments(attachments => ({
                ...attachments,
                items: [...attachments.items.filter(x => x.id != id)]
            }))
        });
    }
}