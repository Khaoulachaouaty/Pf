import Axios from "./caller_service";

let getAllUsers = () => {
    return Axios.get('tickets/allUsers')
}

let deleteUSer = (selectedRowId) => {
    return Axios.delete('tickets/delUser/'+selectedRowId);
}

let creerUser = (user) => {
    return Axios.post('/tickets/register',user);
}

let getProfile = () => {
    return Axios.get('tickets/current')
}

let updateProfile = (formData) => {
    return Axios.put('tickets/updateProfile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
let updatePassword = (data) => {
    return Axios.patch('tickets/change-password', data)
}

export const userService = {
    getAllUsers, deleteUSer, creerUser, getProfile, updateProfile, updatePassword,
}