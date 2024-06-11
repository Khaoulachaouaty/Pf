import { Routes, Route } from "react-router-dom";
import NotFound from "../admin/components/NotFound";
import MiniDrawer from "./magasinier";
import Accueil from "./Accueil";
import Profile from "./components/Profile";
import Article from "./Article";
import Historique from "./Historique";
import Dashboard from "./Dashboard/Accueil";

const MagasinierRouter = () => {
  return (
    <Routes>
      <Route element={<MiniDrawer />}>
        <Route path="demandes" element={<Accueil />} />
        <Route index element={<Accueil />} />
        <Route path="profile" element={<Profile />} />
        <Route path="article" element={<Article />} /> 
        <Route path="accueil" element={<Dashboard />} />
        <Route path="historique" element={<Historique />} /> 
      </Route>
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default MagasinierRouter;
