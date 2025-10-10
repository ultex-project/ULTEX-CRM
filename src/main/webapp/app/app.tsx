import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs';

import React, { useEffect } from 'react';
import { Card } from 'reactstrap';
import { BrowserRouter, useLocation } from 'react-router-dom'; // 👈 Add useLocation
import { ToastContainer } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

// 👇 Create a wrapper component to use useLocation
const AppContent = () => {
  const dispatch = useAppDispatch();
  const location = useLocation(); // 👈 Get current route

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  // 👇 Check if current route is dashboard (or starts with /dashboard)
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isLoginRoute = location.pathname.startsWith('/login');
  const hideChrome = isDashboardRoute || isLoginRoute;

  // 👇 Adjust padding: no header = no top padding
  const paddingTop = hideChrome ? '0' : '60px';

  return (
    <div className="app-container" style={{ paddingTop }}>
      <ToastContainer position="top-left" className="toastify-container" toastClassName="toastify-toast" />
      <ErrorBoundary>
        {/* 👇 Only render Header if NOT on dashboard */}
        {!hideChrome && (
          <Header
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            currentLocale={currentLocale}
            ribbonEnv={ribbonEnv}
            isInProduction={isInProduction}
            isOpenAPIEnabled={isOpenAPIEnabled}
          />
        )}
      </ErrorBoundary>
      <div id="app-view-container">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
        {/* 👇 Only render Footer if NOT on dashboard */}
        {!hideChrome && <Footer />}
      </div>
    </div>
  );
};

export const App = () => (
  <BrowserRouter basename={baseHref}>
    <AppContent />
  </BrowserRouter>
);

export default App;
