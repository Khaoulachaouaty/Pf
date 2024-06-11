import axios from "axios"
import { Account_service } from "./account_service"

// Paramétrage de base d'axios
const Axios = axios.create({
    baseURL: 'http://localhost:8086'
})

/*
    Intercepteur pour le token
*/

Axios.interceptors.request.use(request => {
    if (Account_service.isLogged()) {
        request.headers.Authorization = 'Bearer ' + Account_service.getToken();
    }
    return request;
});

export default Axios

