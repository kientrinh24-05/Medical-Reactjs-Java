import { useSetRecoilState, useRecoilState, useResetRecoilState } from 'recoil';

import { accountAtom, usersAtom } from '@/_state';
import { useNavigate } from 'react-router';
export { useUserActions };

function useUserActions() {
    const setUsers = useSetRecoilState(usersAtom);
    const [profile, setProfile] = useRecoilState(accountAtom);
    const navigate = useNavigate();
    return {
        login,
        logout,
        resetPass,
        getList,
        show,
        update,
        create,
        destroy,
        resetUsers: useResetRecoilState(usersAtom),
    }

    function login(body) {
        console.log(body ,'body');
        return axios.post(`/authenticate`, {
            username: body.username,
            password: body.password
        })
            .then(({ data }) => {
                console.log(data);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
               localStorage.setItem("access_token", data.token);
                // window.axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("access_token");
                navigate("/")
            });
    }

    function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        localStorage.removeItem('access_token');
        window.axios.defaults.headers.common["Authorization"] = null;
        setProfile(null);
        navigate("/login")
    }

    function show(id) {
        return axios.get("/api/v1/user/user_get_detail/" + id);
    }
    function resetPass(id, body) {
        return axios.put("/api/users/" + id + "/reset-password", body);
    }
    function getList(params) {
        return axios.post("/api/v1/user/user_get_list_paging_sort_search_filter",params).then((data) => setUsers({
            items: data.data.data.content,
            total: data.data.data.totalElements,
            loaded: true,
        }));
    }
    function create(params) {
        return axios.post(`/api/v1/user/user_create`, params)
            .then(({ data }) => {
                setUsers(user => ({
                    ...user,
                    items: [
                        ...user.items,
                        data
                    ]
                }))
                return data;

            });
    }

    function update(data) {
        return axios.put(`/api/v1/user/user_update`, data)
            .then(({ data }) => {
                setUsers(user => {
                    const newUsers = { ...user };
                    const index = newUsers.items.findIndex(x => x.id == id);
                    if (index >= 0) {
                        newUsers.items[index] = data;
                    }
                    return newUsers
                })

                // if (id === profile?.id) {
                //     setProfile({
                //         ...profile,
                //         ...data
                //     });
                // }
                return data;
            });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function destroy(id) {
        return axios.post(`/api/v1/user/user_delete` , id).then(() => {
                // remove user from list after deleting
                setUsers(users => ({
                    ...users,
                    items: [
                        ...users.items.filter(x => x.id !== id)
                    ]
                }))
            });
    }
}