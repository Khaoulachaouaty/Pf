import Axios from "./caller_service";

let getTotalTicket = () => {
    return Axios.get('/tickets/api/total')
}

let getEnAttenteTicket = () => {
    return Axios.get('/tickets/api/pending')
}

let getTicketAReliser = () => {
    return Axios.get('/tickets/api/todo')
}

let getTicketRealise = () => {
    return Axios.get('/tickets/api/done')
}

let getTicketBloque = () => {
    return Axios.get('/tickets/api/blocked')
}

let getTicketAnnuler = () => {
    return Axios.get('/tickets/api/cancelled')
}

export const NombreTickets = {
    getTotalTicket, getEnAttenteTicket, getTicketAReliser, getTicketRealise, getTicketAnnuler, getTicketBloque,
}