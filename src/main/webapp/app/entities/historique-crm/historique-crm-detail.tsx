import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './historique-crm.reducer';

export const HistoriqueCRMDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const historiqueCRMEntity = useAppSelector(state => state.historiqueCRM.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="historiqueCRMDetailsHeading">
          <Translate contentKey="crmApp.historiqueCRM.detail.title">HistoriqueCRM</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{historiqueCRMEntity.id}</dd>
          <dt>
            <span id="dateInteraction">
              <Translate contentKey="crmApp.historiqueCRM.dateInteraction">Date Interaction</Translate>
            </span>
          </dt>
          <dd>
            {historiqueCRMEntity.dateInteraction ? (
              <TextFormat value={historiqueCRMEntity.dateInteraction} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="canal">
              <Translate contentKey="crmApp.historiqueCRM.canal">Canal</Translate>
            </span>
          </dt>
          <dd>{historiqueCRMEntity.canal}</dd>
          <dt>
            <span id="agent">
              <Translate contentKey="crmApp.historiqueCRM.agent">Agent</Translate>
            </span>
          </dt>
          <dd>{historiqueCRMEntity.agent}</dd>
          <dt>
            <span id="resume">
              <Translate contentKey="crmApp.historiqueCRM.resume">Resume</Translate>
            </span>
          </dt>
          <dd>{historiqueCRMEntity.resume}</dd>
          <dt>
            <span id="etat">
              <Translate contentKey="crmApp.historiqueCRM.etat">Etat</Translate>
            </span>
          </dt>
          <dd>{historiqueCRMEntity.etat}</dd>
          <dt>
            <span id="observation">
              <Translate contentKey="crmApp.historiqueCRM.observation">Observation</Translate>
            </span>
          </dt>
          <dd>{historiqueCRMEntity.observation}</dd>
          <dt>
            <Translate contentKey="crmApp.historiqueCRM.client">Client</Translate>
          </dt>
          <dd>{historiqueCRMEntity.client ? historiqueCRMEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/historique-crm" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/historique-crm/${historiqueCRMEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default HistoriqueCRMDetail;
