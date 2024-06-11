import { Routes, Route } from "react-router-dom";
import NotFound from "../admin/components/NotFound";
import MiniDrawer from "./technicien";
import Calendar from "./calendar/Calendar";
import EqFamille from "./eqfamille/EqFamille";
import Equipement from "./equipement/Equipement";
import EqType from "./eqtype/EqType";
import Intervention from "./intervention/Intervention";
import Details from "./equipement/Details";
import AddEq from "./equipement/AddEq";
import AjoutIntervention from "./intervention/Ajout";
import PieceRechange from "./PieceRechange";
import InterventionHistorique from "./intervention/InterventionHistorique";
import Profile from "./components/Profile";
import Accueil from "./Dashboard/Accueil";

const TechnicienRouter = () => {
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
        <Route path="equipement/details" element={<Details />} />
        <Route path="equipement/addEquipement" element={<AddEq />} /> 
        <Route path="creer-intervention" element={<AjoutIntervention />} />
        <Route path="creer-intervention" element={<AjoutIntervention />} />
        <Route path="piece-rechange" element={<PieceRechange />} />
        <Route path="historique" element={<InterventionHistorique />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default TechnicienRouter;
