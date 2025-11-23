import React from 'react';
import { Route } from 'react-router-dom';

import Loadable from 'react-loadable';

import LoginPage from 'app/custom/auth/LoginPage';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import EntitiesRoutes from 'app/entities/routes';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES } from 'app/config/constants';
import DashboardLayout from 'app/custom/dashboard/DashboardLayout';
import AdminDashboard from 'app/custom/dashboard/AdminDashboard';
import ProspectListPage from 'app/custom/dashboard/modules/contact/ProspectListPage';
import ProspectCreatePage from 'app/custom/dashboard/modules/contact/ProspectCreatePage';
import ProspectViewPage from 'app/custom/dashboard/modules/contact/ProspectViewPage';
import DataDashboardPage from 'app/custom/dashboard/pages/data/DataDashboardPage';
import DataHistoryPage from 'app/custom/dashboard/pages/data/DataHistoryPage';
import SocieteLieeListPage from 'app/custom/dashboard/modules/societe-liee/SocieteLieeListPage';
import SocieteLieeCreatePage from 'app/custom/dashboard/modules/societe-liee/SocieteLieeCreatePage';
import SocieteLieeEditPage from 'app/custom/dashboard/modules/societe-liee/SocieteLieeEditPage';
import SocieteLieeViewPage from 'app/custom/dashboard/modules/societe-liee/SocieteLieeViewPage';
import ClientListPage from 'app/custom/dashboard/modules/client/ClientListPage';
import ClientViewPage from 'app/custom/dashboard/modules/client/ClientViewPage';
import ClientDemandCreatePage from 'app/custom/dashboard/modules/client/ClientDemandCreatePage';
import ClientCreatePage from 'app/custom/dashboard/modules/client/ClientCreatePage';
import ClientEditPage from 'app/custom/dashboard/modules/client/ClientEditPage';
import ProductListPage from 'app/custom/dashboard/modules/product/ProductListPage';
import ProductCreatePage from 'app/custom/dashboard/modules/product/ProductCreatePage';
import ProductEditPage from 'app/custom/dashboard/modules/product/ProductEditPage';
import ProductViewPage from 'app/custom/dashboard/modules/product/ProductViewPage';
import SousServiceListPage from 'app/custom/dashboard/modules/sous-service/SousServiceListPage';
import DemandeListPage from 'app/custom/dashboard/modules/demande/DemandeListPage';

const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => loading,
});
const AppRoutes = () => {
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="logout" element={<Logout />} />
        <Route path="account">
          <Route
            path="*"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route>
        <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN, AUTHORITIES.DATA]}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="contact/new" element={<ProspectCreatePage />} />
          <Route path="contact" element={<ProspectListPage />} />
          <Route path="prospect/:id/view" element={<ProspectViewPage />} />
          <Route
            path="data"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.DATA, AUTHORITIES.ADMIN]}>
                <DataDashboardPage />
              </PrivateRoute>
            }
          />
          <Route path="societe-liee">
            <Route path="list" element={<SocieteLieeListPage />} />
            <Route path="new" element={<SocieteLieeCreatePage />} />
            <Route path=":id/edit" element={<SocieteLieeEditPage />} />
            <Route path=":id/view" element={<SocieteLieeViewPage />} />
          </Route>
          <Route path="societes-liees">
            <Route path="new" element={<SocieteLieeCreatePage />} />
            <Route path=":id/edit" element={<SocieteLieeEditPage />} />
            <Route path=":id/view" element={<SocieteLieeViewPage />} />
          </Route>
          <Route
            path="data/history"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.DATA, AUTHORITIES.ADMIN]}>
                <DataHistoryPage />
              </PrivateRoute>
            }
          />
          <Route path="clients" element={<ClientListPage />} />
          <Route path="clients/new" element={<ClientCreatePage />} />
          <Route path="clients/:id/view" element={<ClientViewPage />} />
          <Route path="clients/:id/edit" element={<ClientEditPage />} />
          <Route path="clients/:clientId/demands/new" element={<ClientDemandCreatePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/new" element={<ProductCreatePage />} />
          <Route path="products/:id/view" element={<ProductViewPage />} />
          <Route path="products/:id/edit" element={<ProductEditPage />} />
          <Route path="demande/list" element={<DemandeListPage />} />
          <Route
            path="sous-services"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.DATA, AUTHORITIES.ADMIN]}>
                <SousServiceListPage />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
              <EntitiesRoutes />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
