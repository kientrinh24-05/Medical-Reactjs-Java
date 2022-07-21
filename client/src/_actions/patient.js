import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { patientAtom } from '@/_state';
export { usePatienttActions };

function usePatienttActions() {
    const setDepartment = useSetRecoilState(patientAtom);
    return {
        getList,
        show,
        update,
        search,
        destroy,
        create,
        reset: () => {
            useResetRecoilState(patientAtom)
        },
    }

    function getList() {
        return axios.get("/api/v1/patients").then(({ data }) => setDepartment({
            items: data,
            loaded: true
        }));
    }
    function search(filter) {
        console.log(filter, 'filter');
        return axios.post("/api/v1/patients/patient_get_list_paging_sort_search_filter", {
            searchKey: filter
        });
    }

    function show(id) {
        return axios.get("/api/v1/patients/patient_get_detail/" + id);
    }
    function create(data) {
        return axios.post("/api/v1/patients/patient_create", data).then(({ data }) => {
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
        return axios.put("/api/v1/patients/patient_update", data).then(({ data }) => {
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
        return axios.post("/api/v1/patients/patient_delete", id).then(() => {
            setDepartment(department => ({
                ...department,
                items: [
                    ...department.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}