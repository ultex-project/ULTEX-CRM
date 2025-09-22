import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Prospect from './prospect';
import ProspectDetail from './prospect-detail';
import ProspectUpdate from './prospect-update';
import ProspectDeleteDialog from './prospect-delete-dialog';

const ProspectRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Prospect />} />
    <Route path="new" element={<ProspectUpdate />} />
    <Route path=":id">
      <Route index element={<ProspectDetail />} />
      <Route path="edit" element={<ProspectUpdate />} />
      <Route path="delete" element={<ProspectDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ProspectRoutes;
