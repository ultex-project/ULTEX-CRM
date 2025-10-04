// src/main/webapp/app/entities/prospect/ProspectListPage.tsx
import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { APP_DATE_FORMAT } from 'app/config/constants';
import dayjs from 'dayjs';

// Define Prospect type (JHipster generates this in `prospect.model.ts`)
import { IProspect } from 'app/shared/model/prospect.model';
import { getEntities, reset } from 'app/entities/prospect/prospect.reducer';
import GenericTable, { Column } from 'app/custom/dashboard/components/Table/GenericTable';

const ProspectListPage = () => {
  const dispatch = useAppDispatch();
  const prospects = useAppSelector(state => state.prospect.entities);
  const loading = useAppSelector(state => state.prospect.loading);
  const totalItems = useAppSelector(state => state.prospect.totalItems);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState('id,asc');

  useEffect(() => {
    dispatch(getEntities({ page, size, sort }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, page, size, sort]);

  const handleSort = (key: string) => {
    const newSort = sort.startsWith(key) && sort.endsWith('asc') ? `${key},desc` : `${key},asc`;
    setSort(newSort);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // JHipster uses 0-based page
  };

  const prospectColumns: Column<IProspect>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: id => (
        <Button color="link" size="sm" className="p-0" onClick={() => alert(`View ${id}`)}>
          {id}
        </Button>
      ),
    },
    {
      key: 'firstName',
      label: 'First Name',
      sortable: true,
      searchable: true,
    },
    {
      key: 'lastName',
      label: 'Last Name',
      sortable: true,
      searchable: true,
    },
    {
      key: 'email',
      label: 'Email',
      searchable: true,
    },
    {
      key: 'phone1',
      label: 'Phone',
    },
    {
      key: 'source',
      label: 'Source',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render(status) {
        const badgeColor = status === 'QUALIFIED' ? 'success' : status === 'CONTACTED' ? 'info' : status === 'LOST' ? 'danger' : 'warning';
        return <span className={`badge bg-${badgeColor}`}>{status}</span>;
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: date => dayjs(date).format(APP_DATE_FORMAT),
    },
    {
      key: 'convertedDate',
      label: 'Converted',
      render: date => (date ? dayjs(date).format(APP_DATE_FORMAT) : '—'),
    },
  ];

  return (
    <div>
      <GenericTable
        data={prospects}
        columns={prospectColumns}
        title="Prospects"
        actions={
          <Button color="primary" size="sm" tag="a" href="/prospect/new">
            <FontAwesomeIcon icon={faPlus} className="me-1" /> New Prospect
          </Button>
        }
        itemsPerPage={size}
        showSearch={false} // We'll add global search later
        onRowClick={prospect => {
          window.location.href = `/prospect/${prospect.id}`;
        }}
      />
    </div>
  );
};

export default ProspectListPage;
