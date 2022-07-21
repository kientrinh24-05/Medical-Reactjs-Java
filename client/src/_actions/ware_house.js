import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { warehouseAtom } from '@/_state';
export { useWareHouseActions };

function useWareHouseActions() {
    const setWarehouse = useSetRecoilState(warehouseAtom);
    return {
        getList,
        show,
        update,
        search,
        destroy,
        create,
        reset: () => {
            useResetRecoilState(warehouseAtom)
        },
    }

    function getList() {
        return axios.get("/api/v1/warehouse").then(({ data }) => setWarehouse({
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
        return axios.get("/api/v1/warehouse/warehouse_get_detail/" + id);
    }
    function create(data) {
        return axios.post("/api/v1/warehouse/warehouse_create", data).then(({ data }) => {
            setWarehouse(department => ({
                ...department,
                items: [
                    ...department.items,
                    data
                ]
            }))
        })
    }
    function update(data) {
        return axios.put("/api/v1/warehouse/warehouse_update", data).then(({ data }) => {
            setWarehouse(department => {
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
        return axios.post("/api/v1/warehouse/warehouse_delete", id).then(() => {
            setWarehouse(department => ({
                ...department,
                items: [
                    ...department.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}