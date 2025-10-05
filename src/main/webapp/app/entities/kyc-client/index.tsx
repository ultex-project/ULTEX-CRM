import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import KycClient from './kyc-client';
import KycClientDetail from './kyc-client-detail';
import KycClientUpdate from './kyc-client-update';
import KycClientDeleteDialog from './kyc-client-delete-dialog';

const KycClientRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<KycClient />} />
    <Route path="new" element={<KycClientUpdate />} />
    <Route path=":id">
      <Route index element={<KycClientDetail />} />
      <Route path="edit" element={<KycClientUpdate />} />
      <Route path="delete" element={<KycClientDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default KycClientRoutes;
