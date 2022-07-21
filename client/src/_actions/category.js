import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { categoryAtom } from '@/_state';
export { useCategoryActions };

function useCategoryActions() {
    const setCategory = useSetRecoilState(categoryAtom);

    return {
        getList,
        show,
        update,
        destroy,
        create,
        reset: () => {
            useResetRecoilState(categoryAtom)
        },
    }

    function getList(params) {
        return axios.get("/api/v1/categories", { params }).then(({ data }) => setCategory({
            items: data,
            total: data.total,
            loaded: true,
        }));
    }

    function show(id) {
        return axios.get("/api/v1/categories/category_get_detail/" + id);
    }
    function create(data) {
        return axios.post("/api/v1/categories/category_create", data).then(({ data }) => {
            setCategory(kpiCategory => ({
                ...kpiCategory,
                items: [
                    ...kpiCategory.items,
                    data
                ]
            }))
        })
    }
    function update(data) {
        var id = parseInt(id);
        return axios.put("/api/v1/categories/category_update", data).then(({ data }) => {
            setCategory(kpiCategory => {
                const depa = { ...kpiCategory };
                const index = depa.items.findIndex(x => x.id == id);
                if (index >= 0) {
                    depa.items[index] = data;
                }
                return depa
            })
        })
    }
    function destroy(id) {
        return axios.post("/api/v1/categories/category_delete", {
            ids: [id]
        }).then(res => {
            setCategory(kpiCategory => ({
                ...kpiCategory,
                items: [
                    ...kpiCategory.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}