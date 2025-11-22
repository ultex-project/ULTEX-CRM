import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './rappel-agent.reducer';

export const RappelAgentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const rappelAgentEntity = useAppSelector(state => state.rappelAgent.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="rappelAgentDetailsHeading">
          <Translate contentKey="crmApp.rappelAgent.detail.title">RappelAgent</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{rappelAgentEntity.id}</dd>
          <dt>
            <span id="rappelDate">
              <Translate contentKey="crmApp.rappelAgent.rappelDate">Rappel Date</Translate>
            </span>
          </dt>
          <dd>
            {rappelAgentEntity.rappelDate ? <TextFormat value={rappelAgentEntity.rappelDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="rappelMessage">
              <Translate contentKey="crmApp.rappelAgent.rappelMessage">Rappel Message</Translate>
            </span>
          </dt>
          <dd>{rappelAgentEntity.rappelMessage}</dd>
          <dt>
            <span id="statutRappel">
              <Translate contentKey="crmApp.rappelAgent.statutRappel">Statut Rappel</Translate>
            </span>
          </dt>
          <dd>{rappelAgentEntity.statutRappel}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="crmApp.rappelAgent.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {rappelAgentEntity.createdAt ? <TextFormat value={rappelAgentEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="crmApp.rappelAgent.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {rappelAgentEntity.updatedAt ? <TextFormat value={rappelAgentEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="crmApp.rappelAgent.etat">Etat</Translate>
          </dt>
          <dd>{rappelAgentEntity.etat ? rappelAgentEntity.etat.id : ''}</dd>
          <dt>
            <Translate contentKey="crmApp.rappelAgent.client">Client</Translate>
          </dt>
          <dd>{rappelAgentEntity.client ? rappelAgentEntity.client.id : ''}</dd>
          <dt>
            <Translate contentKey="crmApp.rappelAgent.agent">Agent</Translate>
          </dt>
          <dd>{rappelAgentEntity.agent ? rappelAgentEntity.agent.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/rappel-agent" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/rappel-agent/${rappelAgentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default RappelAgentDetail;
