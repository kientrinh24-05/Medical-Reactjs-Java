import { useSetRecoilState, useResetRecoilState } from 'recoil';
import { accountAtom } from '@/_state';
import { useNavigate } from 'react-router';
export { useAccountActions };

function useAccountActions() {
    const setAccount = useSetRecoilState(accountAtom);
    return {
        getProfile,
        logout,
        reset: useResetRecoilState(accountAtom),
    }

    function logout(){
        axios.delete("/api/logout");
        localStorage.removeItem("access_token");
    }

    function getProfile() {
        return axios.get("/api/account").then(({ data }) => setAccount(data));
    }

}