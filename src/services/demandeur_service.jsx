import Axios from "./caller_service";

let getAllDemandeurs = () => {
    return Axios.get('/tickets/api/allDemandeurs')
}

let getDemandeurs = () => {
    return Axios.get('/tickets/Demandeurett')
}

let getDemandeur = (id) => {
    return Axios.get('/tickets/api/getbycodedemandeur/'+id)
}

let deleteDemandeur = (selectedRowId) => {
    return Axios.delete('/tickets/delDemandeur/'+selectedRowId);
}

let creerDemandeur = (dm) => {
    return Axios.post('/tickets/addDemandeur',dm);
}

export const demandeurService = {
    getAllDemandeurs, deleteDemandeur, creerDemandeur, getDemandeur, getDemandeurs,
}