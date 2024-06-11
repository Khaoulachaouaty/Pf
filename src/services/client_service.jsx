import Axios from "./caller_service";

let getAllClients = () => {
    return Axios.get('/tickets/api/allClients')
}

let deleteClient = (selectedRowId) => {
    return Axios.delete('/tickets/api/deleteclient/'+selectedRowId);
}

let creerClient = (client) => {
    return Axios.post('/tickets/api/addclient',client);
}

export const clientService = {
    getAllClients, deleteClient, creerClient, 
}