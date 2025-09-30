import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './client.reducer';

export const ClientDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const clientEntity = useAppSelector(state => state.client.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="clientDetailsHeading">
          <Translate contentKey="crmApp.client.detail.title">Client</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{clientEntity.id}</dd>
          <dt>
            <span id="clientId">
              <Translate contentKey="crmApp.client.clientId">Client Id</Translate>
            </span>
          </dt>
          <dd>{clientEntity.clientId}</dd>
          <dt>
            <span id="firstName">
              <Translate contentKey="crmApp.client.firstName">First Name</Translate>
            </span>
          </dt>
          <dd>{clientEntity.firstName}</dd>
          <dt>
            <span id="lastName">
              <Translate contentKey="crmApp.client.lastName">Last Name</Translate>
            </span>
          </dt>
          <dd>{clientEntity.lastName}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="crmApp.client.email">Email</Translate>
            </span>
          </dt>
          <dd>{clientEntity.email}</dd>
          <dt>
            <span id="phone1">
              <Translate contentKey="crmApp.client.phone1">Phone 1</Translate>
            </span>
          </dt>
          <dd>{clientEntity.phone1}</dd>
          <dt>
            <span id="phone2">
              <Translate contentKey="crmApp.client.phone2">Phone 2</Translate>
            </span>
          </dt>
          <dd>{clientEntity.phone2}</dd>
          <dt>
            <span id="cin">
              <Translate contentKey="crmApp.client.cin">Cin</Translate>
            </span>
          </dt>
          <dd>{clientEntity.cin}</dd>
          <dt>
            <span id="address">
              <Translate contentKey="crmApp.client.address">Address</Translate>
            </span>
          </dt>
          <dd>{clientEntity.address}</dd>
          <dt>
            <span id="city">
              <Translate contentKey="crmApp.client.city">City</Translate>
            </span>
          </dt>
          <dd>{clientEntity.city}</dd>
          <dt>
            <span id="country">
              <Translate contentKey="crmApp.client.country">Country</Translate>
            </span>
          </dt>
          <dd>{clientEntity.country}</dd>
          <dt>
            <span id="deliveryAddress">
              <Translate contentKey="crmApp.client.deliveryAddress">Delivery Address</Translate>
            </span>
          </dt>
          <dd>{clientEntity.deliveryAddress}</dd>
          <dt>
            <span id="referredBy">
              <Translate contentKey="crmApp.client.referredBy">Referred By</Translate>
            </span>
          </dt>
          <dd>{clientEntity.referredBy}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="crmApp.client.status">Status</Translate>
            </span>
          </dt>
          <dd>{clientEntity.status}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="crmApp.client.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{clientEntity.createdAt ? <TextFormat value={clientEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="crmApp.client.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{clientEntity.updatedAt ? <TextFormat value={clientEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="crmApp.client.company">Company</Translate>
          </dt>
          <dd>{clientEntity.company ? clientEntity.company.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/client" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/client/${clientEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ClientDetail;
