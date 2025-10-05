import client from 'app/entities/client/client.reducer';
import prospect from 'app/entities/prospect/prospect.reducer';
import opportunity from 'app/entities/opportunity/opportunity.reducer';
import internalUser from 'app/entities/internal-user/internal-user.reducer';
import company from 'app/entities/company/company.reducer';
import contact from 'app/entities/contact/contact.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  client,
  prospect,
  opportunity,
  internalUser,
  company,
  contact,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
