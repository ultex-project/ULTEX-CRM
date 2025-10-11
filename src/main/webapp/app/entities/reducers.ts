import client from 'app/entities/client/client.reducer';
import prospect from 'app/entities/prospect/prospect.reducer';
import opportunity from 'app/entities/opportunity/opportunity.reducer';
import internalUser from 'app/entities/internal-user/internal-user.reducer';
import company from 'app/entities/company/company.reducer';
import contact from 'app/entities/contact/contact.reducer';
import societeLiee from 'app/entities/societe-liee/societe-liee.reducer';
import contactAssocie from 'app/entities/contact-associe/contact-associe.reducer';
import documentClient from 'app/entities/document-client/document-client.reducer';
import demandeClient from 'app/entities/demande-client/demande-client.reducer';
import produitDemande from 'app/entities/produit-demande/produit-demande.reducer';
import historiqueCRM from 'app/entities/historique-crm/historique-crm.reducer';
import kycClient from 'app/entities/kyc-client/kyc-client.reducer';
import history from 'app/entities/history/history.reducer';
import devise from 'app/entities/devise/devise.reducer';
import incoterm from 'app/entities/incoterm/incoterm.reducer';
import pays from 'app/entities/pays/pays.reducer';
import sousService from 'app/entities/sous-service/sous-service.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  client,
  prospect,
  opportunity,
  internalUser,
  company,
  contact,
  societeLiee,
  contactAssocie,
  documentClient,
  demandeClient,
  produitDemande,
  historiqueCRM,
  kycClient,
  history,
  devise,
  incoterm,
  pays,
  sousService,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
