import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import InternalUser from './internal-user';
import InternalUserDetail from './internal-user-detail';
import InternalUserUpdate from './internal-user-update';
import InternalUserDeleteDialog from './internal-user-delete-dialog';

const InternalUserRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<InternalUser />} />
    <Route path="new" element={<InternalUserUpdate />} />
    <Route path=":id">
      <Route index element={<InternalUserDetail />} />
      <Route path="edit" element={<InternalUserUpdate />} />
      <Route path="delete" element={<InternalUserDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default InternalUserRoutes;
