import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ProduitDemande from './produit-demande';
import ProduitDemandeDetail from './produit-demande-detail';
import ProduitDemandeUpdate from './produit-demande-update';
import ProduitDemandeDeleteDialog from './produit-demande-delete-dialog';

const ProduitDemandeRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ProduitDemande />} />
    <Route path="new" element={<ProduitDemandeUpdate />} />
    <Route path=":id">
      <Route index element={<ProduitDemandeDetail />} />
      <Route path="edit" element={<ProduitDemandeUpdate />} />
      <Route path="delete" element={<ProduitDemandeDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ProduitDemandeRoutes;
