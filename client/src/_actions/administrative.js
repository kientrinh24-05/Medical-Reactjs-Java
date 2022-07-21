import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { administrativeAtom } from '@/_state';
export { useAdministrativeActions };

function useAdministrativeActions() {
    const setDepartment = useSetRecoilState(administrativeAtom);
    return {
        getList,
        show,
        update,
        search,
        destroy,
        create,
        reset: () => {
            useResetRecoilState(administrativeAtom)
        },
    }

    function getList() {
        return axios.get("/api/v1/shop").then(({ data }) => setDepartment({
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
        return axios.get("/api/v1/shop/shop_get_detail/" + id);
    }
    function create(data) {
        return axios.post("/api/v1/shop/shop_create", data).then(({ data }) => {
            setDepartment(department => ({
                ...department,
                items: [
                    ...department.items,
                    data
                ]
            }))
        })
    }
    function update(data) {
        return axios.put("/api/v1/shop/shop_update", data).then(({ data }) => {
            setDepartment(department => {
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
        return axios.post("/api/v1/shop/shop_delete", id).then(() => {
            setDepartment(department => ({
                ...department,
                items: [
                    ...department.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}