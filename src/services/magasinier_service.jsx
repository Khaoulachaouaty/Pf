import Axios from "./caller_service";

let getAllMagasiniers = () => {
    return Axios.get('/tickets/allMagasiniers')
}


export const magasinierService = {
    getAllMagasiniers, 
}