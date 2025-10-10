import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './history.reducer';

export const HistoryDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const historyEntity = useAppSelector(state => state.history.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="historyDetailsHeading">
          <Translate contentKey="crmApp.history.detail.title">History</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{historyEntity.id}</dd>
          <dt>
            <span id="entityName">
              <Translate contentKey="crmApp.history.entityName">Entity Name</Translate>
            </span>
          </dt>
          <dd>{historyEntity.entityName}</dd>
          <dt>
            <span id="entityId">
              <Translate contentKey="crmApp.history.entityId">Entity Id</Translate>
            </span>
          </dt>
          <dd>{historyEntity.entityId}</dd>
          <dt>
            <span id="action">
              <Translate contentKey="crmApp.history.action">Action</Translate>
            </span>
          </dt>
          <dd>{historyEntity.action}</dd>
          <dt>
            <span id="fieldChanged">
              <Translate contentKey="crmApp.history.fieldChanged">Field Changed</Translate>
            </span>
          </dt>
          <dd>{historyEntity.fieldChanged}</dd>
          <dt>
            <span id="oldValue">
              <Translate contentKey="crmApp.history.oldValue">Old Value</Translate>
            </span>
          </dt>
          <dd>{historyEntity.oldValue}</dd>
          <dt>
            <span id="newValue">
              <Translate contentKey="crmApp.history.newValue">New Value</Translate>
            </span>
          </dt>
          <dd>{historyEntity.newValue}</dd>
          <dt>
            <span id="performedBy">
              <Translate contentKey="crmApp.history.performedBy">Performed By</Translate>
            </span>
          </dt>
          <dd>{historyEntity.performedBy}</dd>
          <dt>
            <span id="performedDate">
              <Translate contentKey="crmApp.history.performedDate">Performed Date</Translate>
            </span>
          </dt>
          <dd>
            {historyEntity.performedDate ? <TextFormat value={historyEntity.performedDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="details">
              <Translate contentKey="crmApp.history.details">Details</Translate>
            </span>
          </dt>
          <dd>{historyEntity.details}</dd>
          <dt>
            <span id="ipAddress">
              <Translate contentKey="crmApp.history.ipAddress">Ip Address</Translate>
            </span>
          </dt>
          <dd>{historyEntity.ipAddress}</dd>
          <dt>
            <span id="userAgent">
              <Translate contentKey="crmApp.history.userAgent">User Agent</Translate>
            </span>
          </dt>
          <dd>{historyEntity.userAgent}</dd>
        </dl>
        <Button tag={Link} to="/history" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/history/${historyEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default HistoryDetail;
