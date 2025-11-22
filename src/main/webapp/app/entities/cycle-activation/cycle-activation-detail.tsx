import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './cycle-activation.reducer';

export const CycleActivationDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const cycleActivationEntity = useAppSelector(state => state.cycleActivation.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="cycleActivationDetailsHeading">
          <Translate contentKey="crmApp.cycleActivation.detail.title">CycleActivation</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{cycleActivationEntity.id}</dd>
          <dt>
            <span id="numeroCycle">
              <Translate contentKey="crmApp.cycleActivation.numeroCycle">Numero Cycle</Translate>
            </span>
          </dt>
          <dd>{cycleActivationEntity.numeroCycle}</dd>
          <dt>
            <span id="dateDebut">
              <Translate contentKey="crmApp.cycleActivation.dateDebut">Date Debut</Translate>
            </span>
          </dt>
          <dd>
            {cycleActivationEntity.dateDebut ? (
              <TextFormat value={cycleActivationEntity.dateDebut} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="dateFin">
              <Translate contentKey="crmApp.cycleActivation.dateFin">Date Fin</Translate>
            </span>
          </dt>
          <dd>
            {cycleActivationEntity.dateFin ? (
              <TextFormat value={cycleActivationEntity.dateFin} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="statutCycle">
              <Translate contentKey="crmApp.cycleActivation.statutCycle">Statut Cycle</Translate>
            </span>
          </dt>
          <dd>{cycleActivationEntity.statutCycle}</dd>
          <dt>
            <span id="commentaire">
              <Translate contentKey="crmApp.cycleActivation.commentaire">Commentaire</Translate>
            </span>
          </dt>
          <dd>{cycleActivationEntity.commentaire}</dd>
          <dt>
            <Translate contentKey="crmApp.cycleActivation.client">Client</Translate>
          </dt>
          <dd>{cycleActivationEntity.client ? cycleActivationEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/cycle-activation" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/cycle-activation/${cycleActivationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CycleActivationDetail;
