import Axios from "./caller_service";

let getAllDepartements = () => {
    return Axios.get('/tickets/api/allDepartement')
}

let addDepartement = (addItem) => {
    return Axios.post('/tickets/api/addDepart',addItem)
}

let updateDepartement = (updateItem) => {
    return Axios.put('/tickets/api/updateDepart',updateItem)
}

let deleteDepartement = (deleteItem) => {
    return Axios.delete('/tickets/api/delDepart/'+deleteItem)
}

export const departementService = {
    getAllDepartements, addDepartement, updateDepartement, deleteDepartement
}