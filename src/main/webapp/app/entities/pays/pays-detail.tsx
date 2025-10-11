import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './pays.reducer';

export const PaysDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const paysEntity = useAppSelector(state => state.pays.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="paysDetailsHeading">
          <Translate contentKey="crmApp.pays.detail.title">Pays</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{paysEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="crmApp.pays.code">Code</Translate>
            </span>
          </dt>
          <dd>{paysEntity.code}</dd>
          <dt>
            <span id="nom">
              <Translate contentKey="crmApp.pays.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{paysEntity.nom}</dd>
          <dt>
            <span id="indicatif">
              <Translate contentKey="crmApp.pays.indicatif">Indicatif</Translate>
            </span>
          </dt>
          <dd>{paysEntity.indicatif}</dd>
        </dl>
        <Button tag={Link} to="/pays" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/pays/${paysEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PaysDetail;
