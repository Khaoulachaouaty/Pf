import { Routes, Route } from "react-router-dom";
import Equipe from "./equipe/employee";
import AjoutEquipe from "./ajout_equipe/AjoutEquipe";
import Dashboard from "./dashboard/Dashboard";
import MiniDrawer from "./admin";
import NotFound from "./components/NotFound";
import Client from "./client/ConsulterClient";
import AjoutClient from "./client/AjoutClient";
import AjoutDemandeurs from "./demandeurs/AjoutDemandeurs";
import Demandeur from "./demandeurs/Demandeur";
import DepartementPage from "./departement/Departement";
import Technicien from "./equipe/Equipe";

const AdminRouter = () => {
  return (
    <Routes>
      <Route element={<MiniDrawer />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="technicien" element={<Technicien />} />
        <Route path="employes" element={<Equipe />} />
        <Route path="ajout_employes" element={<AjoutEquipe />} />
        <Route path="demandeurs" element={<Demandeur />} />
        <Route path="ajout_demandeur" element={<AjoutDemandeurs />} />
        <Route path="client" element={<Client />} />
        <Route path="ajout_client" element={<AjoutClient />} />
        <Route path="departement" element={<DepartementPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AdminRouter;
