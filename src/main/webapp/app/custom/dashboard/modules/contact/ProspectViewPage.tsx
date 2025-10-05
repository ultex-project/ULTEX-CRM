import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, reset } from 'app/entities/prospect/prospect.reducer';

const renderValue = (value: React.ReactNode) =>
  value !== undefined && value !== null && value !== '' ? value : <span className="text-muted">--</span>;

const formatTimestamp = (value?: dayjs.Dayjs | string | null) => {
  if (!value) {
    return <span className="text-muted">--</span>;
  }
  return dayjs(value).format('DD MMM YYYY HH:mm');
};

const ProspectViewPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const prospect = useAppSelector(state => state.prospect.entity);
  const loading = useAppSelector(state => state.prospect.loading);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  const fullName = `${prospect.firstName ?? ''} ${prospect.lastName ?? ''}`.trim();

  return (
    <div className="prospect-view-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button color="link" tag={Link} to="/dashboard/contact" className="px-0 text-decoration-none">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to prospects
          </Button>
          <h2 className="mt-2 mb-0">{fullName || prospect.email || `Prospect #${prospect.id ?? ''}`}</h2>
          <p className="text-muted mb-0">Created {formatTimestamp(prospect.createdAt)}</p>
        </div>
        <div className="d-flex gap-2">
          {prospect.id ? (
            <Button color="primary" tag={Link} to={`/prospect/${prospect.id}/edit`}>
              <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit prospect
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white">
          <h5 className="mb-0">Prospect information</h5>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : (
            <Row className="gy-4">
              <Col md="6">
                <dl className="row mb-0 gy-3">
                  <dt className="col-sm-4 text-muted">First name</dt>
                  <dd className="col-sm-8">{renderValue(prospect.firstName)}</dd>

                  <dt className="col-sm-4 text-muted">Last name</dt>
                  <dd className="col-sm-8">{renderValue(prospect.lastName)}</dd>

                  <dt className="col-sm-4 text-muted">Email</dt>
                  <dd className="col-sm-8">{renderValue(prospect.email)}</dd>

                  <dt className="col-sm-4 text-muted">Primary phone</dt>
                  <dd className="col-sm-8">{renderValue(prospect.phone1)}</dd>

                  <dt className="col-sm-4 text-muted">Secondary phone</dt>
                  <dd className="col-sm-8">{renderValue(prospect.phone2)}</dd>

                  <dt className="col-sm-4 text-muted">Status</dt>
                  <dd className="col-sm-8">{renderValue(prospect.status)}</dd>

                  <dt className="col-sm-4 text-muted">Source</dt>
                  <dd className="col-sm-8">{renderValue(prospect.source)}</dd>
                </dl>
              </Col>
              <Col md="6">
                <dl className="row mb-0 gy-3">
                  <dt className="col-sm-4 text-muted">Company</dt>
                  <dd className="col-sm-8">{renderValue(prospect.company?.name)}</dd>

                  <dt className="col-sm-4 text-muted">Address</dt>
                  <dd className="col-sm-8">{renderValue(prospect.address)}</dd>

                  <dt className="col-sm-4 text-muted">City</dt>
                  <dd className="col-sm-8">{renderValue(prospect.city)}</dd>

                  <dt className="col-sm-4 text-muted">Country</dt>
                  <dd className="col-sm-8">{renderValue(prospect.country)}</dd>

                  <dt className="col-sm-4 text-muted">Referred by</dt>
                  <dd className="col-sm-8">{renderValue(prospect.referredBy)}</dd>

                  <dt className="col-sm-4 text-muted">Owner</dt>
                  <dd className="col-sm-8">{renderValue(prospect.convertedBy?.fullName)}</dd>

                  <dt className="col-sm-4 text-muted">Last updated</dt>
                  <dd className="col-sm-8">{formatTimestamp(prospect.updatedAt)}</dd>
                </dl>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProspectViewPage;
