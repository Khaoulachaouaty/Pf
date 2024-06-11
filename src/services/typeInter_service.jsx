import Axios from "./caller_service";

let getAllTypeInter = () => {
    return Axios.get('/tickets/api/allTypeTickets')
}

let addTypeInter = (addItem) => {
    return Axios.post('/tickets/api/addetype',addItem)
}

let updateTypeInter = (updateItem) => {
    return Axios.put('/tickets/api/updatetype',updateItem)
}

let deleteTypeInter = (deleteItem) => {
    return Axios.delete('/tickets/api/deletetype/'+deleteItem)
}

export const typeInterService = {
    getAllTypeInter, addTypeInter, updateTypeInter, deleteTypeInter 
}