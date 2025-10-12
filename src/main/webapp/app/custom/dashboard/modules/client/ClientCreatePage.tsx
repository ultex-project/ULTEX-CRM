import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { createEntity } from 'app/entities/client/client.reducer';
import ClientForm from 'app/entities/client/components/ClientForm';
import { IClient } from 'app/shared/model/client.model';

import './ClientCreatePage.scss';
import DashboardPhoneInput from './components/DashboardPhoneInput';

const ClientCreatePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (payload: IClient) => {
    const response = await dispatch(createEntity(payload)).unwrap();
    const createdId = response?.data?.id ?? payload.id;
    if (createdId) {
      navigate(`/dashboard/clients/${createdId}/view`, { replace: true });
    } else {
      navigate('/dashboard/clients', { replace: true });
    }
  };

  return (
    <div className="client-create-page">
      <ClientForm mode="create" onSubmit={handleSubmit} telephoneInputComponent={DashboardPhoneInput} />
    </div>
  );
};

export default ClientCreatePage;
