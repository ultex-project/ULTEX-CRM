import React, { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import { IDemandeClient } from 'app/shared/model/demande-client.model';

import DemandeForm from './DemandeForm';

export const DemandeClientUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const demandeId = isNew ? undefined : Number(id);

  const handleCancel = useCallback(() => {
    navigate(`/demande-client${location.search}`);
  }, [location.search, navigate]);

  const handleSaved = useCallback(
    (saved: IDemandeClient) => {
      if (saved.id) {
        navigate(`/demande-client/${saved.id}`);
        return;
      }
      handleCancel();
    },
    [handleCancel, navigate],
  );

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="10" lg="9">
          <DemandeForm demandeId={demandeId} onCancel={handleCancel} onSaved={handleSaved} />
        </Col>
      </Row>
    </div>
  );
};

export default DemandeClientUpdate;
