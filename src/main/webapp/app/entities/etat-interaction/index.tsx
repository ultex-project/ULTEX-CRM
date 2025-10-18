import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import EtatInteraction from './etat-interaction';
import EtatInteractionDetail from './etat-interaction-detail';
import EtatInteractionUpdate from './etat-interaction-update';
import EtatInteractionDeleteDialog from './etat-interaction-delete-dialog';

const EtatInteractionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<EtatInteraction />} />
    <Route path="new" element={<EtatInteractionUpdate />} />
    <Route path=":id">
      <Route index element={<EtatInteractionDetail />} />
      <Route path="edit" element={<EtatInteractionUpdate />} />
      <Route path="delete" element={<EtatInteractionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default EtatInteractionRoutes;
