import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Langue from './langue';
import LangueDetail from './langue-detail';
import LangueUpdate from './langue-update';
import LangueDeleteDialog from './langue-delete-dialog';

const LangueRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Langue />} />
    <Route path="new" element={<LangueUpdate />} />
    <Route path=":id">
      <Route index element={<LangueDetail />} />
      <Route path="edit" element={<LangueUpdate />} />
      <Route path="delete" element={<LangueDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default LangueRoutes;
