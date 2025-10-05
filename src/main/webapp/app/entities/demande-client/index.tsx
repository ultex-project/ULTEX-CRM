import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import DemandeClient from './demande-client';
import DemandeClientDetail from './demande-client-detail';
import DemandeClientUpdate from './demande-client-update';
import DemandeClientDeleteDialog from './demande-client-delete-dialog';

const DemandeClientRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<DemandeClient />} />
    <Route path="new" element={<DemandeClientUpdate />} />
    <Route path=":id">
      <Route index element={<DemandeClientDetail />} />
      <Route path="edit" element={<DemandeClientUpdate />} />
      <Route path="delete" element={<DemandeClientDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default DemandeClientRoutes;
