import Axios from "./caller_service";


let getCountByTechnicien = () => {
    return Axios.get('/tickets/api/countByTechnician')
}

let getTicketByClient = () => {
    return Axios.get('/tickets/api/ticketByClient')
}

export const DashboardManagerService = {
    getCountByTechnicien, getTicketByClient,
}