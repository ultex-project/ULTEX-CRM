import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/client">
        <Translate contentKey="global.menu.entities.client" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/prospect">
        <Translate contentKey="global.menu.entities.prospect" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/opportunity">
        <Translate contentKey="global.menu.entities.opportunity" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/internal-user">
        <Translate contentKey="global.menu.entities.internalUser" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/company">
        <Translate contentKey="global.menu.entities.company" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/contact">
        <Translate contentKey="global.menu.entities.contact" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/societe-liee">
        <Translate contentKey="global.menu.entities.societeLiee" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/contact-associe">
        <Translate contentKey="global.menu.entities.contactAssocie" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/document-client">
        <Translate contentKey="global.menu.entities.documentClient" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/demande-client">
        <Translate contentKey="global.menu.entities.demandeClient" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/produit-demande">
        <Translate contentKey="global.menu.entities.produitDemande" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/historique-crm">
        <Translate contentKey="global.menu.entities.historiqueCrm" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/kyc-client">
        <Translate contentKey="global.menu.entities.kycClient" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/history">
        <Translate contentKey="global.menu.entities.history" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/devise">
        <Translate contentKey="global.menu.entities.devise" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/incoterm">
        <Translate contentKey="global.menu.entities.incoterm" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/pays">
        <Translate contentKey="global.menu.entities.pays" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/sous-service">
        <Translate contentKey="global.menu.entities.sousService" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
