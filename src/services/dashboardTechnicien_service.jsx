import Axios from "./caller_service";

let getTicketsDone = () => {
    return Axios.get('/tickets/api/doneTicketsTechnicien')
}

let getCountByMonth = () => {
    return Axios.get('/tickets/api/countByTechnicianAndMonth')
}
  
export const dashboardTechnicienService = {
    getTicketsDone, getCountByMonth
}