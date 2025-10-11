import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './sous-service.reducer';

export const SousServiceDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const sousServiceEntity = useAppSelector(state => state.sousService.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="sousServiceDetailsHeading">
          <Translate contentKey="crmApp.sousService.detail.title">SousService</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{sousServiceEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="crmApp.sousService.code">Code</Translate>
            </span>
          </dt>
          <dd>{sousServiceEntity.code}</dd>
          <dt>
            <span id="libelle">
              <Translate contentKey="crmApp.sousService.libelle">Libelle</Translate>
            </span>
          </dt>
          <dd>{sousServiceEntity.libelle}</dd>
          <dt>
            <Translate contentKey="crmApp.sousService.demandes">Demandes</Translate>
          </dt>
          <dd>
            {sousServiceEntity.demandes
              ? sousServiceEntity.demandes.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {sousServiceEntity.demandes && i === sousServiceEntity.demandes.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/sous-service" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/sous-service/${sousServiceEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SousServiceDetail;
