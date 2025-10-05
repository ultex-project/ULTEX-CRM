import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ContactAssocie from './contact-associe';
import ContactAssocieDetail from './contact-associe-detail';
import ContactAssocieUpdate from './contact-associe-update';
import ContactAssocieDeleteDialog from './contact-associe-delete-dialog';

const ContactAssocieRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ContactAssocie />} />
    <Route path="new" element={<ContactAssocieUpdate />} />
    <Route path=":id">
      <Route index element={<ContactAssocieDetail />} />
      <Route path="edit" element={<ContactAssocieUpdate />} />
      <Route path="delete" element={<ContactAssocieDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ContactAssocieRoutes;
