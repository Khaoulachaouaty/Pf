import Axios from "./caller_service";

let getImage = (id) => {
    return Axios.get('/tickets/api/image/get/info/'+id)
}

let uploadImage = (data) => {
    return Axios.post('/tickets/api/image/upload',data)
}

export const imageService = {
    getImage, uploadImage
}