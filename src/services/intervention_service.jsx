import Axios from "./caller_service";

let getAllIntervention = () => {
    return Axios.get('/tickets/api/allInterventions')
}

let getIntervention = (code) => {
    return Axios.get('/tickets/api/getById/'+code)
}


let addIntervention = (intervention) => {
    return Axios.post('/tickets/api/addInter',intervention)
}

let updateIntervention = (updateItem) => {
    return Axios.put('/tickets/api/updateInter',updateItem)
}


export const interventionService = {
    getAllIntervention, addIntervention, updateIntervention, getIntervention,
}