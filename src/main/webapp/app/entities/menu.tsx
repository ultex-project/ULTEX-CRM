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
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
