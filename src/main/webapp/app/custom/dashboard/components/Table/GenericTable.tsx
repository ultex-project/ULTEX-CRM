// src/main/webapp/app/shared/components/GenericTable.tsx
import React, { useState, useMemo } from 'react';
import { Table, Pagination, PaginationItem, PaginationLink, Input, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faSearch } from '@fortawesome/free-solid-svg-icons';

// Types
export type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

export type GenericTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  title: string;
  actions?: React.ReactNode;
  itemsPerPage?: number;
  showSearch?: boolean;
  onRowClick?: (row: T) => void;
};

const GenericTable = <T extends Record<string, any>>({
  data,
  columns,
  title,
  actions,
  itemsPerPage = 10,
  showSearch = true,
  onRowClick,
}: GenericTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      columns.some(col => col.searchable && row[col.key] && String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [data, columns, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const { key, direction } = sortConfig;
    return [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        <div className="d-flex gap-2 align-items-center">
          {showSearch && (
            <div className="d-flex align-items-center border rounded px-2" style={{ minWidth: '200px' }}>
              <FontAwesomeIcon icon={faSearch} className="text-muted me-2" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border-0 py-1"
                style={{ width: '100%' }}
              />
            </div>
          )}
          {actions}
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={String(col.key)}
                    onClick={() => col.sortable && handleSort(col.key)}
                    style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                  >
                    <div className="d-flex align-items-center">
                      {col.label}
                      {col.sortable && (
                        <span className="ms-1">
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === 'asc' ? (
                              <FontAwesomeIcon icon={faSortUp} size="sm" />
                            ) : (
                              <FontAwesomeIcon icon={faSortDown} size="sm" />
                            )
                          ) : (
                            <FontAwesomeIcon icon={faSort} size="sm" className="text-muted" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr key={idx} onClick={() => onRowClick && onRowClick(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                    {columns.map(col => (
                      <td key={String(col.key)}>{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-muted">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-3 justify-content-end mb-0">
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let page = i + 1;
              if (currentPage > 3 && totalPages > 5) {
                page = currentPage - 2 + i;
                if (page < 1) page = 1;
                if (page > totalPages) page = totalPages;
              }
              return (
                <PaginationItem key={page} active={page === currentPage}>
                  <PaginationLink onClick={() => handlePageChange(page)}>{page}</PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          </Pagination>
        )}
      </CardBody>
    </Card>
  );
};

export default GenericTable;
