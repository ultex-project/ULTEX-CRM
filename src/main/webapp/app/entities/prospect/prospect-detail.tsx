import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './prospect.reducer';

export const ProspectDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const prospectEntity = useAppSelector(state => state.prospect.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="prospectDetailsHeading">
          <Translate contentKey="crmApp.prospect.detail.title">Prospect</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.id}</dd>
          <dt>
            <span id="firstName">
              <Translate contentKey="crmApp.prospect.firstName">First Name</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.firstName}</dd>
          <dt>
            <span id="lastName">
              <Translate contentKey="crmApp.prospect.lastName">Last Name</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.lastName}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="crmApp.prospect.email">Email</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.email}</dd>
          <dt>
            <span id="phone">
              <Translate contentKey="crmApp.prospect.phone">Phone</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.phone}</dd>
          <dt>
            <span id="source">
              <Translate contentKey="crmApp.prospect.source">Source</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.source}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="crmApp.prospect.status">Status</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.status}</dd>
          <dt>
            <Translate contentKey="crmApp.prospect.convertedTo">Converted To</Translate>
          </dt>
          <dd>{prospectEntity.convertedTo ? prospectEntity.convertedTo.id : ''}</dd>
          <dt>
            <Translate contentKey="crmApp.prospect.convertedBy">Converted By</Translate>
          </dt>
          <dd>{prospectEntity.convertedBy ? prospectEntity.convertedBy.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/prospect" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/prospect/${prospectEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProspectDetail;
