import { Routes, Route } from "react-router-dom";
import NotFound from "../admin/components/NotFound";
import MiniDrawer from "./manager";
import Calendar from "./calendar/Calendar";
import EqFamille from "./eqfamille/EqFamille";
import Equipement from "./equipement/Equipement";
import EqType from "./eqtype/EqType";
import Intervention from "./intervention/Intervention";
import Accueil from "./Dashboard/Accueil";
import UpdateIntervention from "./intervention/update";
import DashboardPage from "./parametrage/Dashboard";
import DepartementPage from "./parametrage/Departement";
import TypePage from "./parametrage/Type";
import CausePage from "./parametrage/Cause";
import NaturePage from "./parametrage/Nature";
import InterventionHistorique from "./intervention/ConsulterHistorique";
import Profile from "./components/Profile";
import Article from "./pieceRechange/Article";
import DemandePieceRechange from "./pieceRechange/DemandePieceRechange";
import PieceRechange from "./pieceRechange/PieceRechange";
import Details from "./equipement/Details";
import Historique from "./pieceRechange/Historique";

const ManagerRouter = () => {
  return (
    <Routes>
      <Route element={<MiniDrawer />}>
        <Route path="calendar" element={<Calendar />} />
        <Route path="eq_famille" element={<EqFamille />} />
        <Route path="equipement" element={<Equipement />} />
        <Route path="eq_type" element={<EqType />} />
        <Route path="intervention" element={<Intervention />} />
        <Route path="accueil" element={<Accueil />} />
        <Route index element={<Accueil />} />
        <Route path="parametrage" element={<DashboardPage />} />
        <Route path="departement" element={<DepartementPage />} />
        <Route path="nature" element={<NaturePage />} />
        <Route path="cause" element={<CausePage />} />
        <Route path="type" element={<TypePage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="creer-intervention" element={<UpdateIntervention />} />
        <Route path="piece-rechange" element={<DemandePieceRechange />} />
        <Route path="historique" element={<InterventionHistorique />} />
        <Route path="liste-piece-rechange" element={<PieceRechange />} />
        <Route path="historique-des-demandes" element={<Historique />} /> 
        <Route path="equipement/details" element={<Details />} />
        <Route path="article" element={<Article />} /> 
      </Route>
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default ManagerRouter;
