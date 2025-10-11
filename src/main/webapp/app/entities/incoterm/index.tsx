import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Incoterm from './incoterm';
import IncotermDetail from './incoterm-detail';
import IncotermUpdate from './incoterm-update';
import IncotermDeleteDialog from './incoterm-delete-dialog';

const IncotermRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Incoterm />} />
    <Route path="new" element={<IncotermUpdate />} />
    <Route path=":id">
      <Route index element={<IncotermDetail />} />
      <Route path="edit" element={<IncotermUpdate />} />
      <Route path="delete" element={<IncotermDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default IncotermRoutes;
