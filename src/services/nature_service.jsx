import Axios from "./caller_service";

let getAllNature = () => {
    return Axios.get('/tickets/api/allNature')
}

let addNature = (addItem) => {
    return Axios.post('/tickets/api/addenature',addItem)
}

let updateNature = (updateItem) => {
    return Axios.put('/tickets/api/updatenature',updateItem)
}

let deleteNature = (deleteItem) => {
    return Axios.delete('/tickets/api/deletenature/'+deleteItem)
}

export const natureService = {
    getAllNature, addNature, updateNature, deleteNature
}