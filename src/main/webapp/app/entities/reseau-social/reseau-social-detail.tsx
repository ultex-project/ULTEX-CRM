import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './reseau-social.reducer';

export const ReseauSocialDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const reseauSocialEntity = useAppSelector(state => state.reseauSocial.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="reseauSocialDetailsHeading">
          <Translate contentKey="crmApp.reseauSocial.detail.title">ReseauSocial</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{reseauSocialEntity.id}</dd>
          <dt>
            <span id="plateforme">
              <Translate contentKey="crmApp.reseauSocial.plateforme">Plateforme</Translate>
            </span>
          </dt>
          <dd>{reseauSocialEntity.plateforme}</dd>
          <dt>
            <span id="urlProfil">
              <Translate contentKey="crmApp.reseauSocial.urlProfil">Url Profil</Translate>
            </span>
          </dt>
          <dd>{reseauSocialEntity.urlProfil}</dd>
          <dt>
            <span id="username">
              <Translate contentKey="crmApp.reseauSocial.username">Username</Translate>
            </span>
          </dt>
          <dd>{reseauSocialEntity.username}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="crmApp.reseauSocial.type">Type</Translate>
            </span>
          </dt>
          <dd>{reseauSocialEntity.type}</dd>
          <dt>
            <Translate contentKey="crmApp.reseauSocial.client">Client</Translate>
          </dt>
          <dd>{reseauSocialEntity.client ? reseauSocialEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/reseau-social" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/reseau-social/${reseauSocialEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ReseauSocialDetail;
