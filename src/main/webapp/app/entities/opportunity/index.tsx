import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Opportunity from './opportunity';
import OpportunityDetail from './opportunity-detail';
import OpportunityUpdate from './opportunity-update';
import OpportunityDeleteDialog from './opportunity-delete-dialog';

const OpportunityRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Opportunity />} />
    <Route path="new" element={<OpportunityUpdate />} />
    <Route path=":id">
      <Route index element={<OpportunityDetail />} />
      <Route path="edit" element={<OpportunityUpdate />} />
      <Route path="delete" element={<OpportunityDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default OpportunityRoutes;
