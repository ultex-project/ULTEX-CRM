import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ReseauSocial from './reseau-social';
import ReseauSocialDetail from './reseau-social-detail';
import ReseauSocialUpdate from './reseau-social-update';
import ReseauSocialDeleteDialog from './reseau-social-delete-dialog';

const ReseauSocialRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ReseauSocial />} />
    <Route path="new" element={<ReseauSocialUpdate />} />
    <Route path=":id">
      <Route index element={<ReseauSocialDetail />} />
      <Route path="edit" element={<ReseauSocialUpdate />} />
      <Route path="delete" element={<ReseauSocialDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ReseauSocialRoutes;
