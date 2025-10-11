import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { Translate } from 'react-jhipster';

import './DataPages.scss';

const DataDashboardPage = () => (
  <div className="data-page">
    <Card className="shadow-sm border-0 data-card">
      <CardHeader className="bg-gradient data-card__header">
        <h2 className="mb-0 text-white">
          <FontAwesomeIcon icon={faDatabase} className="me-2" />
          <Translate contentKey="crmApp.data.title">Data verification workspace</Translate>
        </h2>
        <p className="mb-0 text-white-50">
          <Translate contentKey="crmApp.data.subtitle">
            Review and validate client submissions, ensuring data accuracy across the organisation.
          </Translate>
        </p>
      </CardHeader>
      <CardBody className="data-card__body">
        <div className="data-card__empty">
          <FontAwesomeIcon icon={faListCheck} className="data-card__empty-icon" />
          <h5>
            <Translate contentKey="crmApp.data.empty.title">No verification tasks yet</Translate>
          </h5>
          <p className="text-muted">
            <Translate contentKey="crmApp.data.empty.subtitle">
              Once there are pending submissions, they will show up here so you can validate, reject or annotate them.
            </Translate>
          </p>
        </div>
      </CardBody>
    </Card>
  </div>
);

export default DataDashboardPage;
