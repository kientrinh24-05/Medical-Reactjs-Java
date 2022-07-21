import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { productAtom } from '@/_state';
export { useProductActions };

function useProductActions() {
    const setCategory = useSetRecoilState(productAtom);


    return {
        getList,
        show,
        update,
        destroy,
        create,
        reset: () => {
            useResetRecoilState(productAtom)
        },
    }

    function getList(params) {
        return axios.post("/api/v1/products/product_get_list_paging_sort_search_filter",  params ).then((data) => setCategory({
            items: data.data.data.content,
            total: data.data.data.totalElements,
            loaded: true,
        }));
    
    }

    function show(id) {
        return axios.get("/api/v1/products/product_get_detail/" + id);
    }
    function create(data) {
        return axios.post("/api/v1/products/product_create", data).then(({ data }) => {
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
        return axios.put("/api/v1/products/product_update", data).then(({ data }) => {
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
        return axios.post("/api/v1/products/product_delete", id)
        .then(res => {
            setCategory(kpiCategory => ({
                ...kpiCategory,
                items: [
                    ...kpiCategory.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}