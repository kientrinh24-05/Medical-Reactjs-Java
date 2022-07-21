import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { rolesAtom, permissionAtom } from '@/_state';
export { useRoleActions };

function useRoleActions() {
    const setRoles = useSetRecoilState(rolesAtom);
    const setPermission = useSetRecoilState(permissionAtom);
    return {
        getList,
        search,
        getPermission,
        reset: () => {
            useResetRecoilState(rolesAtom)
        },
    }

    function getList() {
        return axios.get("/api/roles").then(({ data }) => {
            setRoles(data)
            return data;
        });
    }
    function search(filter,options) {
        return axios.get("/api/roles", {
            params: filter
        },options);
    }
    function getPermission() {
        return axios.get("/api/permissions").then(({ data }) => setPermission(data));
    }
}