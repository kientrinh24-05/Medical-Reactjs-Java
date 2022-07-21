import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { drugsAtom } from '@/_state';
export { usePrugsActions };

function usePrugsActions() {
    const setDepartment = useSetRecoilState(drugsAtom);
    return {
        getList,
        show,
        update,
        search,
        destroy,
        create,
        reset: () => {
            useResetRecoilState(drugsAtom)
        },
    }

    function getList() {
        return axios.get("/api/v1/drugs").then(({ data }) => setDepartment({
            items: data,
            loaded: true
        }));
    }
    function search(filter) {
        console.log(filter, 'filter');
        return axios.post("/api/v1/drugs/drug_get_list_paging_sort_search_filter", {
            searchKey: filter
        });
    }

    function show(id) {
        return axios.get("/api/v1/drugs/drug_get_detail/" + id);
    }
    function create(data) {
        return axios.post("/api/v1/drugs/drug_create", data).then(({ data }) => {
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
        return axios.put("/api/v1/drugs/drug_update", data).then(({ data }) => {
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
        return axios.post("/api/v1/drugs/drug_delete", id).then(() => {
            setDepartment(department => ({
                ...department,
                items: [
                    ...department.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}