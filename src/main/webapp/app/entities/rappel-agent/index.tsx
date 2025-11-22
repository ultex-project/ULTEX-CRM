import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import RappelAgent from './rappel-agent';
import RappelAgentDetail from './rappel-agent-detail';
import RappelAgentUpdate from './rappel-agent-update';
import RappelAgentDeleteDialog from './rappel-agent-delete-dialog';

const RappelAgentRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<RappelAgent />} />
    <Route path="new" element={<RappelAgentUpdate />} />
    <Route path=":id">
      <Route index element={<RappelAgentDetail />} />
      <Route path="edit" element={<RappelAgentUpdate />} />
      <Route path="delete" element={<RappelAgentDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default RappelAgentRoutes;
