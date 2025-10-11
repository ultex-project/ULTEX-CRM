import React from 'react';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Translate } from 'react-jhipster';

import './DataPages.scss';

const mockHistory = [] as Array<{ id: number; entity: string; status: string; performedBy: string; performedAt: string; note?: string }>;

const DataHistoryPage = () => (
  <div className="data-page">
    <Card className="shadow-sm border-0 data-card">
      <CardHeader className="bg-gradient data-card__header">
        <h2 className="mb-0 text-white">
          <FontAwesomeIcon icon={faClockRotateLeft} className="me-2" />
          <Translate contentKey="crmApp.data.history.title">Data verification history</Translate>
        </h2>
        <p className="mb-0 text-white-50">
          <Translate contentKey="crmApp.data.history.subtitle">
            Track every validation action, including comments and decisions applied to client records.
          </Translate>
        </p>
      </CardHeader>
      <CardBody className="data-card__body">
        {mockHistory.length === 0 ? (
          <div className="data-card__empty">
            <FontAwesomeIcon icon={faClockRotateLeft} className="data-card__empty-icon" />
            <h5>
              <Translate contentKey="crmApp.data.history.empty.title">No historical entries yet</Translate>
            </h5>
            <p className="text-muted">
              <Translate contentKey="crmApp.data.history.empty.subtitle">
                When verifications are completed, you will see the activity log here for auditing purposes.
              </Translate>
            </p>
          </div>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="crmApp.data.history.columns.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="crmApp.data.history.columns.entity">Entity</Translate>
                </th>
                <th>
                  <Translate contentKey="crmApp.data.history.columns.status">Status</Translate>
                </th>
                <th>
                  <Translate contentKey="crmApp.data.history.columns.performedBy">Performed By</Translate>
                </th>
                <th>
                  <Translate contentKey="crmApp.data.history.columns.performedAt">Performed At</Translate>
                </th>
                <th>
                  <Translate contentKey="crmApp.data.history.columns.note">Note</Translate>
                </th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.entity}</td>
                  <td>{entry.status}</td>
                  <td>{entry.performedBy}</td>
                  <td>{entry.performedAt}</td>
                  <td>{entry.note ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  </div>
);

export default DataHistoryPage;
