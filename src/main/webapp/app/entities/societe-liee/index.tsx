import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SocieteLiee from './societe-liee';
import SocieteLieeDetail from './societe-liee-detail';
import SocieteLieeUpdate from './societe-liee-update';
import SocieteLieeDeleteDialog from './societe-liee-delete-dialog';

const SocieteLieeRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SocieteLiee />} />
    <Route path="new" element={<SocieteLieeUpdate />} />
    <Route path=":id">
      <Route index element={<SocieteLieeDetail />} />
      <Route path="edit" element={<SocieteLieeUpdate />} />
      <Route path="delete" element={<SocieteLieeDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SocieteLieeRoutes;
