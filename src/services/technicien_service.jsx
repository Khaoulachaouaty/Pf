import Axios from "./caller_service";

let getAllTechniciens = () => {
    return Axios.get('/tickets/api/allTechniciens')
}

let getTechniciens = () => {
    return Axios.get('/tickets/Techniciens')
}

let getTechnicien = (code) => {
    return Axios.get('/tickets/api/getbycodetechnicien/'+code)
}

let getTechByDep = (codeDepart) => {
    return Axios.get('/tickets/api/getTechDepart/'+codeDepart)
}

let updateResponsable = (id, res) => {
    return Axios.put(`/tickets/api/responsable/${id}`, null, {
        params: {
            responsable: res
        }
    });
}

export const technicienService = {
    getAllTechniciens, getTechByDep, getTechniciens, updateResponsable, getTechnicien
}