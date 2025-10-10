import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import DocumentClient from './document-client';
import DocumentClientDetail from './document-client-detail';
import DocumentClientUpdate from './document-client-update';
import DocumentClientDeleteDialog from './document-client-delete-dialog';

const DocumentClientRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<DocumentClient />} />
    <Route path="new" element={<DocumentClientUpdate />} />
    <Route path=":id">
      <Route index element={<DocumentClientDetail />} />
      <Route path="edit" element={<DocumentClientUpdate />} />
      <Route path="delete" element={<DocumentClientDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default DocumentClientRoutes;
