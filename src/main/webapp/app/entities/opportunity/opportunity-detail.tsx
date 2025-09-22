import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './opportunity.reducer';

export const OpportunityDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const opportunityEntity = useAppSelector(state => state.opportunity.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="opportunityDetailsHeading">
          <Translate contentKey="crmApp.opportunity.detail.title">Opportunity</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{opportunityEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="crmApp.opportunity.title">Title</Translate>
            </span>
          </dt>
          <dd>{opportunityEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="crmApp.opportunity.description">Description</Translate>
            </span>
          </dt>
          <dd>{opportunityEntity.description}</dd>
          <dt>
            <span id="amount">
              <Translate contentKey="crmApp.opportunity.amount">Amount</Translate>
            </span>
          </dt>
          <dd>{opportunityEntity.amount}</dd>
          <dt>
            <span id="stage">
              <Translate contentKey="crmApp.opportunity.stage">Stage</Translate>
            </span>
          </dt>
          <dd>{opportunityEntity.stage}</dd>
          <dt>
            <span id="closeDate">
              <Translate contentKey="crmApp.opportunity.closeDate">Close Date</Translate>
            </span>
          </dt>
          <dd>
            {opportunityEntity.closeDate ? <TextFormat value={opportunityEntity.closeDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="crmApp.opportunity.assignedTo">Assigned To</Translate>
          </dt>
          <dd>{opportunityEntity.assignedTo ? opportunityEntity.assignedTo.id : ''}</dd>
          <dt>
            <Translate contentKey="crmApp.opportunity.client">Client</Translate>
          </dt>
          <dd>{opportunityEntity.client ? opportunityEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/opportunity" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/opportunity/${opportunityEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default OpportunityDetail;
