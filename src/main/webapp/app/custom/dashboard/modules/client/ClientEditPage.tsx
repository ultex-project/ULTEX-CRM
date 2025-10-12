import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Alert, Breadcrumb, BreadcrumbItem, Card, CardBody, Spinner } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';

import ClientForm from 'app/entities/client/components/ClientForm';
import { IClient } from 'app/shared/model/client.model';
import DashboardPhoneInput from './components/DashboardPhoneInput';

const ClientEditPage = () => {
  const { id } = useParams<'id'>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<IClient | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/dashboard/clients', { replace: true });
      return;
    }

    const fetchClient = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<IClient>(`api/clients/${id}`);
        setClient(response.data ?? null);
      } catch (err) {
        setError(translate('crmApp.client.edit.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, navigate]);

  const handleSubmit = async (payload: IClient) => {
    if (!id) {
      return;
    }
    await axios.put<IClient>(`api/clients/${id}`, { ...payload, id: Number(id) });
    navigate(`/dashboard/clients/${id}/view`, {
      replace: true,
      state: { successMessage: translate('crmApp.client.edit.success') },
    });
  };

  return (
    <div className="client-edit-page py-4">
      <Breadcrumb listClassName="bg-transparent px-0">
        <BreadcrumbItem>
          <Link to="/dashboard">
            <Translate contentKey="crmApp.client.edit.breadcrumb.dashboard" />
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/dashboard/clients">
            <Translate contentKey="crmApp.client.edit.breadcrumb.clients" />
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <Translate contentKey="crmApp.client.edit.breadcrumb.current" />
        </BreadcrumbItem>
      </Breadcrumb>

      <h2 className="mb-3">
        <Translate contentKey="crmApp.client.form.editTitle" />
      </h2>

      {error ? (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Card className="shadow-sm border-0">
          <CardBody className="text-center py-5">
            <Spinner color="primary" />
          </CardBody>
        </Card>
      ) : client ? (
        <ClientForm mode="edit" initialData={client} onSubmit={handleSubmit} telephoneInputComponent={DashboardPhoneInput} />
      ) : (
        <Card className="shadow-sm border-0">
          <CardBody className="text-muted">
            <Translate contentKey="crmApp.client.edit.notFound" />
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ClientEditPage;
