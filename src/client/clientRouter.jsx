import { Routes, Route } from "react-router-dom";
import Client from "./client";
import HomePage from "./Dashboard/Dashboard";
import AjoutTicket from "./Consulter/AjoutTicket";
import ConsulterTicket from "./Consulter/ConsulterTicket";
import FeedbackPage from "./Consulter/FeedBack";
import Historique from "./Consulter/Historique";
import NotFound from "../admin/components/NotFound";
import Riri from "./Consulter/riri";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./components/Profile";

const ClientRouter = () => {
  return (
    <Routes>
      <Route element={<Client />}>
        <Route index path="accueil" element={<Dashboard />} />
        <Route path="creer-ticket" element={<AjoutTicket />} />
        <Route path="consulter_tickets" element={<ConsulterTicket />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="historique" element={<Historique />} />        
        <Route path="riri" element={<Riri />} />        
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRouter;