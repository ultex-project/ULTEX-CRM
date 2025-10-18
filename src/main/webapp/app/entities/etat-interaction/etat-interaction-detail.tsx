import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './etat-interaction.reducer';

export const EtatInteractionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const etatInteractionEntity = useAppSelector(state => state.etatInteraction.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="etatInteractionDetailsHeading">
          <Translate contentKey="crmApp.etatInteraction.detail.title">EtatInteraction</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{etatInteractionEntity.id}</dd>
          <dt>
            <span id="etat">
              <Translate contentKey="crmApp.etatInteraction.etat">Etat</Translate>
            </span>
          </dt>
          <dd>{etatInteractionEntity.etat}</dd>
          <dt>
            <span id="dateEtat">
              <Translate contentKey="crmApp.etatInteraction.dateEtat">Date Etat</Translate>
            </span>
          </dt>
          <dd>
            {etatInteractionEntity.dateEtat ? (
              <TextFormat value={etatInteractionEntity.dateEtat} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="agent">
              <Translate contentKey="crmApp.etatInteraction.agent">Agent</Translate>
            </span>
          </dt>
          <dd>{etatInteractionEntity.agent}</dd>
          <dt>
            <span id="observation">
              <Translate contentKey="crmApp.etatInteraction.observation">Observation</Translate>
            </span>
          </dt>
          <dd>{etatInteractionEntity.observation}</dd>
          <dt>
            <Translate contentKey="crmApp.etatInteraction.historique">Historique</Translate>
          </dt>
          <dd>{etatInteractionEntity.historique ? etatInteractionEntity.historique.id : ''}</dd>
          <dt>
            <Translate contentKey="crmApp.etatInteraction.cycle">Cycle</Translate>
          </dt>
          <dd>{etatInteractionEntity.cycle ? etatInteractionEntity.cycle.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/etat-interaction" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/etat-interaction/${etatInteractionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default EtatInteractionDetail;
