import Axios from "./caller_service";

let getAllDemandePR = () => {
    return Axios.get('/tickets/api/allRequests')
}

let addDemandePR = (addItem) => {
    return Axios.post('/tickets/api/addPieceRequest',addItem)
}


let updateStatut = (interCode, nouveauStatus) => {
  return Axios.put(`/tickets/api/updateStatutDemande/${interCode}`, null, {
      params: {
          newStatutDemande: nouveauStatus
      }
  });
}

let updateFinale = (interCode, newArticleId) => {
    return Axios.put(`/tickets/api/updateArticleForPieceRequests/${interCode}`, null, {
        params: {
            newArticleId: newArticleId
        }
    });
}

let updateTestQteStock = (interCode) => {
  return Axios.put('/tickets/api/updateQuantiteStock/'+interCode)
}

let updateChampDone = (interCode) => {
    return Axios.put('/tickets/api/updateChampDone/'+interCode)
}

let updateChapNonDone = (interCode) => {
    return Axios.put('/tickets/api/updateChapNonDone/'+interCode)
}

let updateQtePR = (interCode, data) => {
    return Axios.put(`/tickets/api/updateQuantitePieceRechange/${interCode}`, data);
}

export const demandePRService = {
    addDemandePR, getAllDemandePR, updateStatut, updateTestQteStock, updateChampDone, updateChapNonDone,
    updateQtePR, updateFinale,
}