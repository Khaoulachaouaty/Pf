import Axios from "./caller_service";

let getAllPieceRechange = () => {
    return Axios.get('/tickets/api/allPieceRechange')
}

let addPieceRechange = (addItem) => {
    return Axios.post('/tickets/api/addPieceRechange',addItem)
}


let deletePieceRechange = (id) => {
  return Axios.delete(`/tickets/api/delPieceRechange/${id.eqptCode}/${id.codeArticle}`);
}


let updatePieceRechange = (piece) => {
    return Axios.put('/tickets/api/updatePieceRechange', piece);
}

export const pieceRechangeService = {
    getAllPieceRechange, addPieceRechange, deletePieceRechange, updatePieceRechange
}