import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './internal-user.reducer';

export const InternalUserDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const internalUserEntity = useAppSelector(state => state.internalUser.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="internalUserDetailsHeading">
          <Translate contentKey="crmApp.internalUser.detail.title">InternalUser</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{internalUserEntity.id}</dd>
          <dt>
            <span id="fullName">
              <Translate contentKey="crmApp.internalUser.fullName">Full Name</Translate>
            </span>
          </dt>
          <dd>{internalUserEntity.fullName}</dd>
          <dt>
            <span id="role">
              <Translate contentKey="crmApp.internalUser.role">Role</Translate>
            </span>
          </dt>
          <dd>{internalUserEntity.role}</dd>
        </dl>
        <Button tag={Link} to="/internal-user" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/internal-user/${internalUserEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default InternalUserDetail;
