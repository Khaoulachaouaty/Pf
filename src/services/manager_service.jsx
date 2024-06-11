import Axios from "./caller_service";

let getAllManagers = () => {
    return Axios.get('/tickets/allManagers')
}


export const managerService = {
    getAllManagers, 
}