import Axios from "./caller_service";

let getTotalTicket = () => {
    return Axios.get('/tickets/api/totalTicketsDemandeur')
}

let getEnAttenteTicket = () => {
    return Axios.get('/tickets/api/pendingTicketsDemandeur')
}

let getTicketAReliser = () => {
    return Axios.get('/tickets/api/todoTicketsDemandeur')
}

let getTicketRealise = () => {
    return Axios.get('/tickets/api/doneTicketsDemandeur')
}

let getTicketBloque = () => {
    return Axios.get('/tickets/api/blockedTicketsDemandeur')
}

let getTicketAnnuler = () => {
    return Axios.get('/tickets/api/cancelledTicketsDemandeur')
}

let getRealizedTicketsCountByMonth = () => {
    return Axios.get('/tickets/api/realizedTicketsCountByMonth')
}

export const DashboardClientService = {
    getTotalTicket, getEnAttenteTicket, getTicketAReliser, getTicketRealise, getTicketAnnuler, getTicketBloque,
    getRealizedTicketsCountByMonth,
}