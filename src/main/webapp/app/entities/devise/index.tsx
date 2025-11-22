import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Devise from './devise';
import DeviseDetail from './devise-detail';
import DeviseUpdate from './devise-update';
import DeviseDeleteDialog from './devise-delete-dialog';

const DeviseRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Devise />} />
    <Route path="new" element={<DeviseUpdate />} />
    <Route path=":id">
      <Route index element={<DeviseDetail />} />
      <Route path="edit" element={<DeviseUpdate />} />
      <Route path="delete" element={<DeviseDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default DeviseRoutes;
