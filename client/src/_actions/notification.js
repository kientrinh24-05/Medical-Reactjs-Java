export { useNotificationActions };

function useNotificationActions() {
    return {
        sendToken,
        martReadAll,
        markAsRead,
    }

    function sendToken(data) {
        return axios.post(`/api/firebases`, data)
    }
    
    function markAsRead(id) {
        return axios.put("/api/notifications/" + id + "/read");
    }
    function martReadAll() {
        return axios.get("/api/notifications/mark-all-as-read")
    }
}