import Axios from "./caller_service";

let getAllNature = () => {
  return Axios.get("/tickets/api/allNature");
};

let addTicket = (ticket) => {
  return Axios.post("/tickets/api/addTicket", ticket);
};

let getAllTickets = () => {
  return Axios.get("/tickets/api/allTickets");
};

let getTicketDemandeur = () => {
  return Axios.get("/tickets/api/TicketDemandeur");
};

let getTicketTech = () => {
  return Axios.get("/tickets/api/TicketTech");
};

let deleteTicket = (code) => {
  return Axios.delete("/tickets/api/deleteTicket/" + code);
};

let getTicket = (ticketId) => {
  return Axios.get("/tickets/api/getByCode/" + ticketId);
};

let updateTicket = (ticket) => {
  return Axios.put("/tickets/api/updateTicket", ticket);
};

let updateTicketStatut = (id, newStatut) => {
  return Axios.put(`/tickets/api/updateTicketStatus/${id}`, null, {
    params: {
      interStatut: newStatut,
    },
  });
};

let updateEventDate = (id, newDatePrevue) => {
    return Axios.put(`/tickets/api/updateDatePrevue/${id}`, null, {
      params: {
        datePrevue: newDatePrevue,
      },
    });
  };
  
let getTicketArchivedManager = () => {
  return Axios.get("/tickets/api/allArchived");
};

let getTicketArchivedClient = () => {
  return Axios.get("/tickets/api/closedDemandeur");
};

let getTicketArchivedTehnicien = () => {
  return Axios.get("/tickets/api/archiveTech");
};

let getTicketCalanderManager = () => {
  return Axios.get("/tickets/api/display");
};

let getTicketCalanderTech = () => {
  return Axios.get("/tickets/api/displayTech");
};

export const ticketService = {
  getAllNature,
  addTicket,
  getAllTickets,
  deleteTicket,
  getTicket,
  getTicketDemandeur,
  getTicketTech,
  updateTicket,
  getTicketArchivedClient,
  getTicketArchivedManager,
  getTicketArchivedTehnicien,
  updateTicketStatut,
  getTicketCalanderManager,
  getTicketCalanderTech,
  updateEventDate,
};
