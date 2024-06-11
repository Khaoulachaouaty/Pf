import Axios from "./caller_service";


let getTotalTechniciens = () => {
    return Axios.get('/tickets/totalTechniciens')
}

let getTotalDemandeurs = () => {
    return Axios.get('/tickets/totalDemandeurs')
}

let getTotalSociete= () => {
    return Axios.get('/tickets/api/totalSocietes')
}

let getTotalTechDepart = () => {
    return Axios.get('/tickets/api/totalTechDepart')
}

let getCountByClient = () => {
    return Axios.get('/tickets/api/countByClient')
}

export const DashboardAdminService = {
    getTotalSociete, getTotalDemandeurs, getTotalTechniciens,
    getCountByClient, getTotalTechDepart
}