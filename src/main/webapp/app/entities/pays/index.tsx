import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Pays from './pays';
import PaysDetail from './pays-detail';
import PaysUpdate from './pays-update';
import PaysDeleteDialog from './pays-delete-dialog';

const PaysRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Pays />} />
    <Route path="new" element={<PaysUpdate />} />
    <Route path=":id">
      <Route index element={<PaysDetail />} />
      <Route path="edit" element={<PaysUpdate />} />
      <Route path="delete" element={<PaysDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PaysRoutes;
