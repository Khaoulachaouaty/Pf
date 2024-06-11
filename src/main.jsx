import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './login';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import NotFound from './admin/components/NotFound';
import AuthGuard from './helpers/AuthGuard';
import AdminRouter from './admin/adminRouter';
import ClientRouter from './client/clientRouter';
import ManagerRouter from './manager/managerRouter';
import TechnicienRouter from './technicien/technicienRouter';
import MagasinierRouter from './magasinier/magasinierRouter';
import ForgotPassword from './password/forgotPassword';
import PasswordResetSent from './password/PasswordResetSent';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/admin/*" element={ <AuthGuard> <AdminRouter /> </AuthGuard>}/>
      <Route path="/client/*" element={<ClientRouter />} />
      <Route path="/login" index element={<Login />} />
      <Route path="/manager/*" element={<ManagerRouter />} />
      <Route path="/technicien/*" element={<TechnicienRouter />} />
      <Route path="/magasinier/*" element={<MagasinierRouter />} />
      <Route path="/mot-de-passe-oublier" element={<ForgotPassword />} />
      <Route path="/mot-de-passe-envoyer" element={<PasswordResetSent />} />
      <Route index element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
