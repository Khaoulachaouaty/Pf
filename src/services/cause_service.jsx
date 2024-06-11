import Axios from "./caller_service";

let getAllCauses = () => {
    return Axios.get('/tickets/api/allCause')
}

let addCause = (addItem) => {
    return Axios.post('/tickets/api/addCause',addItem)
}

let updateCause = (updateItem) => {
    return Axios.put('/tickets/api/updateCause',updateItem)
}

let deleteCause = (deleteItem) => {
    return Axios.delete('/tickets/api/delCause/'+deleteItem)
}

export const causeService = {
    getAllCauses, addCause, updateCause, deleteCause
}