import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './kyc-client.reducer';

export const KycClientDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const kycClientEntity = useAppSelector(state => state.kycClient.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="kycClientDetailsHeading">
          <Translate contentKey="crmApp.kycClient.detail.title">KycClient</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{kycClientEntity.id}</dd>
          <dt>
            <span id="scoreStaff">
              <Translate contentKey="crmApp.kycClient.scoreStaff">Score Staff</Translate>
            </span>
          </dt>
          <dd>{kycClientEntity.scoreStaff}</dd>
          <dt>
            <span id="comportements">
              <Translate contentKey="crmApp.kycClient.comportements">Comportements</Translate>
            </span>
          </dt>
          <dd>{kycClientEntity.comportements}</dd>
          <dt>
            <span id="remarques">
              <Translate contentKey="crmApp.kycClient.remarques">Remarques</Translate>
            </span>
          </dt>
          <dd>{kycClientEntity.remarques}</dd>
          <dt>
            <span id="completudeKyc">
              <Translate contentKey="crmApp.kycClient.completudeKyc">Completude Kyc</Translate>
            </span>
          </dt>
          <dd>{kycClientEntity.completudeKyc}</dd>
          <dt>
            <span id="responsable">
              <Translate contentKey="crmApp.kycClient.responsable">Responsable</Translate>
            </span>
          </dt>
          <dd>{kycClientEntity.responsable}</dd>
          <dt>
            <Translate contentKey="crmApp.kycClient.client">Client</Translate>
          </dt>
          <dd>{kycClientEntity.client ? kycClientEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/kyc-client" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/kyc-client/${kycClientEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default KycClientDetail;
