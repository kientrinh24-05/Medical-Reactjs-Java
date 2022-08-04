import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { invoicesAtom } from '@/_state';
export { useInvoicesActions };

function useInvoicesActions() {
    const setDepartment = useSetRecoilState(invoicesAtom);
    return {
        getList,
        show,
        update,
        search,
        invoiceComplete,
        invoiceCancel,
        create,
        reset: () => {
            useResetRecoilState(invoicesAtom)
        },
    }

    function getList(params) {
        return axios.post("/api/v1/invoices/invoice_get_list_paging_sort_search_filter",  params ).then((data) => setDepartment({
            items: data.data.data.content,
            total: data.data.data.totalElements,
            loaded: true,
        }));
    }
    function search(filter) {
        console.log(filter, 'filter');
        return axios.post("/api/v1/departments/department_get_list_paging_sort_search_filter", {
            searchKey: filter
        });
    }

    function show(id) {
        return axios.get("/api/v1/departments/department_get_detail/" + id);
    }
    function create(data) {
        return axios.post("/api/v1/invoices/invoice_create", data).then(({ data }) => {
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
        return axios.put("/api/v1/departments/department_update", data).then(({ data }) => {
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
    function invoiceComplete(id) {

        return axios.post("/api/v1/invoices/invoice_complete", id)
        .then(res => {
            setDepartment(department => ({
                ...department,
                items: [
                    ...department.items.filter(x => x.id != id),
                ]
            }))
        });
    }
    function invoiceCancel(id) {
        return axios.post("/api/v1/invoices/invoice_cancel", id)
        .then(res => {
            setDepartment(department => ({
                ...department,
                items: [
                    ...department.items.filter(x => x.id != id),
                ]
            }))
        });
    }
}