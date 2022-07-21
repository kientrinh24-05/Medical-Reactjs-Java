import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { supplierAtom } from '@/_state';
export { useSuppliertActions };

function useSuppliertActions() {
    const setSupplier = useSetRecoilState(supplierAtom);
    return {
        getList,
        show,
        update,
        search,
        destroy,
        create,
        reset: () => {
            useResetRecoilState(supplierAtom)
        },
    }

    function getList() {
        return axios.get("/api/v1/suppliers").then(({ data }) => setSupplier({
            items: data,
            loaded: true
        }));
    }
    function search(filter) {
        console.log(filter, 'filter');
        return axios.post("/api/v1/departments/department_get_list_paging_sort_search_filter", {
            searchKey: filter
        });
    }

    function show(id) {
        return axios.get("/api/v1/suppliers/supplier_get_detail/" + id);
    }
    function create(data) {
        return axios.post("/api/v1/suppliers/supplier_create", data).then(({ data }) => {
            setSupplier(department => ({
                ...department,
                items: [
                    ...department.items,
                    data
                ]
            }))
        })
    }
    function update(data) {
        return axios.put("/api/v1/suppliers/supplier_update", data).then(({ data }) => {
            setSupplier(department => {
                const depa = { ...department };
                const index = depa.items.findIndex(x => x.id == data.id);
                if (index >= 0) {
                    depa.items[index] = data;
                }
                return depa
            })

        })
    }
    function destroy(id) {
        return axios.post("/api/v1/suppliers/supplier_delete", id).then(() => {
            setSupplier(department => ({
                ...department,
                items: [
                    ...department.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}