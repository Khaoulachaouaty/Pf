import Axios from "./caller_service";

let getNotifications = () => {
    return Axios.get('tickets/api/allNotifications')
}

let marquerLue= () => {
    return Axios.put('tickets/api/markAllAsRead')
}

export const notificationService = {
    getNotifications, marquerLue
}
