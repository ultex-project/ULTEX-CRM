import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
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
            <span id="phone1">
              <Translate contentKey="crmApp.prospect.phone1">Phone 1</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.phone1}</dd>
          <dt>
            <span id="phone2">
              <Translate contentKey="crmApp.prospect.phone2">Phone 2</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.phone2}</dd>
          <dt>
            <span id="source">
              <Translate contentKey="crmApp.prospect.source">Source</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.source}</dd>
          <dt>
            <span id="cin">
              <Translate contentKey="crmApp.prospect.cin">Cin</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.cin}</dd>
          <dt>
            <span id="address">
              <Translate contentKey="crmApp.prospect.address">Address</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.address}</dd>
          <dt>
            <span id="city">
              <Translate contentKey="crmApp.prospect.city">City</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.city}</dd>
          <dt>
            <span id="country">
              <Translate contentKey="crmApp.prospect.country">Country</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.country}</dd>
          <dt>
            <span id="deliveryAddress">
              <Translate contentKey="crmApp.prospect.deliveryAddress">Delivery Address</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.deliveryAddress}</dd>
          <dt>
            <span id="referredBy">
              <Translate contentKey="crmApp.prospect.referredBy">Referred By</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.referredBy}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="crmApp.prospect.status">Status</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.status}</dd>
          <dt>
            <span id="convertedDate">
              <Translate contentKey="crmApp.prospect.convertedDate">Converted Date</Translate>
            </span>
          </dt>
          <dd>
            {prospectEntity.convertedDate ? <TextFormat value={prospectEntity.convertedDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="crmApp.prospect.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.createdAt ? <TextFormat value={prospectEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="crmApp.prospect.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{prospectEntity.updatedAt ? <TextFormat value={prospectEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="crmApp.prospect.convertedTo">Converted To</Translate>
          </dt>
          <dd>{prospectEntity.convertedTo ? prospectEntity.convertedTo.id : ''}</dd>
          <dt>
            <Translate contentKey="crmApp.prospect.convertedBy">Converted By</Translate>
          </dt>
          <dd>{prospectEntity.convertedBy ? prospectEntity.convertedBy.id : ''}</dd>
          <dt>
            <Translate contentKey="crmApp.prospect.company">Company</Translate>
          </dt>
          <dd>{prospectEntity.company ? prospectEntity.company.id : ''}</dd>
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
