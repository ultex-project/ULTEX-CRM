import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SousService from './sous-service';
import SousServiceDetail from './sous-service-detail';
import SousServiceUpdate from './sous-service-update';
import SousServiceDeleteDialog from './sous-service-delete-dialog';

const SousServiceRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SousService />} />
    <Route path="new" element={<SousServiceUpdate />} />
    <Route path=":id">
      <Route index element={<SousServiceDetail />} />
      <Route path="edit" element={<SousServiceUpdate />} />
      <Route path="delete" element={<SousServiceDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SousServiceRoutes;
