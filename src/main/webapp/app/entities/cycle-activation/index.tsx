import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import CycleActivation from './cycle-activation';
import CycleActivationDetail from './cycle-activation-detail';
import CycleActivationUpdate from './cycle-activation-update';
import CycleActivationDeleteDialog from './cycle-activation-delete-dialog';

const CycleActivationRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<CycleActivation />} />
    <Route path="new" element={<CycleActivationUpdate />} />
    <Route path=":id">
      <Route index element={<CycleActivationDetail />} />
      <Route path="edit" element={<CycleActivationUpdate />} />
      <Route path="delete" element={<CycleActivationDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default CycleActivationRoutes;
