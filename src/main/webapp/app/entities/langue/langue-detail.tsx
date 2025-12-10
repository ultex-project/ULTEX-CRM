import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './langue.reducer';

export const LangueDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const langueEntity = useAppSelector(state => state.langue.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="langueDetailsHeading">
          <Translate contentKey="crmApp.langue.detail.title">Langue</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{langueEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="crmApp.langue.code">Code</Translate>
            </span>
          </dt>
          <dd>{langueEntity.code}</dd>
          <dt>
            <span id="nom">
              <Translate contentKey="crmApp.langue.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{langueEntity.nom}</dd>
        </dl>
        <Button tag={Link} to="/langue" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/langue/${langueEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default LangueDetail;
