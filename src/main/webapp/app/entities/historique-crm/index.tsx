import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import HistoriqueCRM from './historique-crm';
import HistoriqueCRMDetail from './historique-crm-detail';
import HistoriqueCRMUpdate from './historique-crm-update';
import HistoriqueCRMDeleteDialog from './historique-crm-delete-dialog';

const HistoriqueCRMRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<HistoriqueCRM />} />
    <Route path="new" element={<HistoriqueCRMUpdate />} />
    <Route path=":id">
      <Route index element={<HistoriqueCRMDetail />} />
      <Route path="edit" element={<HistoriqueCRMUpdate />} />
      <Route path="delete" element={<HistoriqueCRMDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default HistoriqueCRMRoutes;
