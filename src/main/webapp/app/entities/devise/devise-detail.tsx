import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './devise.reducer';

export const DeviseDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const deviseEntity = useAppSelector(state => state.devise.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="deviseDetailsHeading">
          <Translate contentKey="crmApp.devise.detail.title">Devise</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{deviseEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="crmApp.devise.code">Code</Translate>
            </span>
          </dt>
          <dd>{deviseEntity.code}</dd>
          <dt>
            <span id="nomComplet">
              <Translate contentKey="crmApp.devise.nomComplet">Nom Complet</Translate>
            </span>
          </dt>
          <dd>{deviseEntity.nomComplet}</dd>
          <dt>
            <span id="symbole">
              <Translate contentKey="crmApp.devise.symbole">Symbole</Translate>
            </span>
          </dt>
          <dd>{deviseEntity.symbole}</dd>
          <dt>
            <span id="pays">
              <Translate contentKey="crmApp.devise.pays">Pays</Translate>
            </span>
          </dt>
          <dd>{deviseEntity.pays}</dd>
        </dl>
        <Button tag={Link} to="/devise" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/devise/${deviseEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default DeviseDetail;
