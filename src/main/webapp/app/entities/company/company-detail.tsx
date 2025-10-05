import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './company.reducer';

export const CompanyDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const companyEntity = useAppSelector(state => state.company.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="companyDetailsHeading">
          <Translate contentKey="crmApp.company.detail.title">Company</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{companyEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="crmApp.company.name">Name</Translate>
            </span>
          </dt>
          <dd>{companyEntity.name}</dd>
          <dt>
            <span id="address">
              <Translate contentKey="crmApp.company.address">Address</Translate>
            </span>
          </dt>
          <dd>{companyEntity.address}</dd>
          <dt>
            <span id="city">
              <Translate contentKey="crmApp.company.city">City</Translate>
            </span>
          </dt>
          <dd>{companyEntity.city}</dd>
          <dt>
            <span id="country">
              <Translate contentKey="crmApp.company.country">Country</Translate>
            </span>
          </dt>
          <dd>{companyEntity.country}</dd>
          <dt>
            <span id="phone">
              <Translate contentKey="crmApp.company.phone">Phone</Translate>
            </span>
          </dt>
          <dd>{companyEntity.phone}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="crmApp.company.email">Email</Translate>
            </span>
          </dt>
          <dd>{companyEntity.email}</dd>
          <dt>
            <span id="website">
              <Translate contentKey="crmApp.company.website">Website</Translate>
            </span>
          </dt>
          <dd>{companyEntity.website}</dd>
          <dt>
            <span id="industry">
              <Translate contentKey="crmApp.company.industry">Industry</Translate>
            </span>
          </dt>
          <dd>{companyEntity.industry}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="crmApp.company.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{companyEntity.createdAt ? <TextFormat value={companyEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="crmApp.company.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{companyEntity.updatedAt ? <TextFormat value={companyEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
        </dl>
        <Button tag={Link} to="/company" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/company/${companyEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CompanyDetail;
