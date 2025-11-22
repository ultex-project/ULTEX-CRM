import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Client from './client';
import Prospect from './prospect';
import Opportunity from './opportunity';
import InternalUser from './internal-user';
import Company from './company';
import Contact from './contact';
import SocieteLiee from './societe-liee';
import ContactAssocie from './contact-associe';
import DocumentClient from './document-client';
import DemandeClient from './demande-client';
import ProduitDemande from './produit-demande';
import HistoriqueCRM from './historique-crm';
import KycClient from './kyc-client';
import History from './history';
import Devise from './devise';
import Incoterm from './incoterm';
import Pays from './pays';
import SousService from './sous-service';
import CycleActivation from './cycle-activation';
import EtatInteraction from './etat-interaction';
import RappelAgent from './rappel-agent';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="client/*" element={<Client />} />
        <Route path="prospect/*" element={<Prospect />} />
        <Route path="opportunity/*" element={<Opportunity />} />
        <Route path="internal-user/*" element={<InternalUser />} />
        <Route path="company/*" element={<Company />} />
        <Route path="contact/*" element={<Contact />} />
        <Route path="societe-liee/*" element={<SocieteLiee />} />
        <Route path="contact-associe/*" element={<ContactAssocie />} />
        <Route path="document-client/*" element={<DocumentClient />} />
        <Route path="demande-client/*" element={<DemandeClient />} />
        <Route path="produit-demande/*" element={<ProduitDemande />} />
        <Route path="historique-crm/*" element={<HistoriqueCRM />} />
        <Route path="kyc-client/*" element={<KycClient />} />
        <Route path="history/*" element={<History />} />
        <Route path="devise/*" element={<Devise />} />
        <Route path="incoterm/*" element={<Incoterm />} />
        <Route path="pays/*" element={<Pays />} />
        <Route path="sous-service/*" element={<SousService />} />
        <Route path="cycle-activation/*" element={<CycleActivation />} />
        <Route path="etat-interaction/*" element={<EtatInteraction />} />
        <Route path="rappel-agent/*" element={<RappelAgent />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
