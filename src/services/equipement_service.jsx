import Axios from "./caller_service";

let getAllTypes = () => {
    return Axios.get('/tickets/api/allType')
}

let getAllFamilles = () => {
    return Axios.get('/tickets/api/allFamille')
}

let getAllEquipements = () => {
    return Axios.get('/tickets/api/all')
}

let getAllEquipementsByClient = (idClient) => {
    return Axios.get('/tickets/api/eqptClient/'+idClient)
}

let getEquipement = (eqptCode) => {
    return Axios.get('/tickets/api/getbyeqptcode/'+eqptCode)
}

let getEquipementF = (eqptCode) => {
    return Axios.get('/tickets/api/getbyeqfacode/'+eqptCode)
}

let updateEquipement = (updatedItem) => {
    return Axios.put('/tickets/api/updateEqpt',updatedItem);
}

let updateType = (updatedItem) => {
    return Axios.put('/tickets/api/updateeqty',updatedItem)
}

let updateFamille = (updatedItem) => {
    return Axios.put('/tickets/api/updateeqfa',updatedItem);
}

let deleteEquipement = (deleteItem) => {
    return Axios.delete('/tickets/api/deleqpt/'+deleteItem);
}


let deleteType = (deleteItem) => {
    return Axios.delete('/tickets/api/deleqty/'+deleteItem)
}

let deleteFamille = (deleteItem) => {
    return Axios.delete('/tickets/api/deleqfa/'+deleteItem);
}

let saveEquipement = (eqpm) => {
    return Axios.post('/tickets/api/addeqpt',eqpm);
}

let saveType = (eqt) => {
    return Axios.post('/tickets/api/addeqty',eqt);
}

let saveFamille = (eqf) => {
    return Axios.post('/tickets/api/addeqfa',eqf);
}

let FilterEquipement = (libelle) => {
    return Axios.get('/tickets/api/searchDesignationContains/'+libelle);
}

let FilterType = (libelle) => {
    return Axios.get('/tickets/api/eqtyLibelleContains/'+libelle);
}

let FilterFamille = (libelle) => {
    return Axios.get('/tickets/api/eqfaLibelleContains/'+libelle);
} 

export const adminService = {
    getAllTypes, getAllFamilles, getAllEquipements, getEquipement, updateEquipement, updateType, deleteType, 
    updateFamille, deleteEquipement, deleteFamille, saveEquipement, saveFamille, saveType, FilterFamille,
    FilterEquipement, FilterType, getAllEquipementsByClient, getEquipementF
}