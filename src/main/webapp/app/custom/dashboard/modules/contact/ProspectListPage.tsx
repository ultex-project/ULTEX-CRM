// src/main/webapp/app/entities/prospect/ProspectListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faPlus,
  faEllipsisV,
  faEye,
  faEdit,
  faTrash,
  faSortUp,
  faSortDown,
  faSort,
  faLayerGroup,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import dayjs from 'dayjs';
import './ProspectListPage.scss';
import { IProspect } from 'app/shared/model/prospect.model';
import { getEntities, reset } from 'app/entities/prospect/prospect.reducer';

type FieldInputType = 'text' | 'select' | 'date';

interface FieldOption {
  value: string;
  label: string;
  type: FieldInputType;
  options?: Array<{ value: string; label: string }>;
}

interface RuleNode {
  id: string;
  field: string;
  operator: string;
  value: string;
  not?: boolean;
}

type GroupCondition = 'AND' | 'OR' | 'AND NOT';

interface GroupNode {
  id: string;
  condition: GroupCondition;
  rules: Array<GroupNode | RuleNode>;
}

type FilterNode = GroupNode | RuleNode;

const FIELD_OPTIONS: FieldOption[] = [
  {
    value: 'characteristics.entity',
    label: 'Characteristics - Entity',
    type: 'select',
    options: [
      { value: 'Root Entity', label: 'Root Entity' },
      { value: 'Subsidiary', label: 'Subsidiary' },
      { value: 'Division', label: 'Division' },
    ],
  },
  {
    value: 'characteristics.type',
    label: 'Characteristics - Type',
    type: 'select',
    options: [
      { value: 'Laptop', label: 'Laptop' },
      { value: 'Desktop', label: 'Desktop' },
      { value: 'Service', label: 'Service' },
      { value: 'Subscription', label: 'Subscription' },
    ],
  },
  {
    value: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'NEW', label: 'New' },
      { value: 'CONTACTED', label: 'Contacted' },
      { value: 'QUALIFIED', label: 'Qualified' },
      { value: 'LOST', label: 'Lost' },
    ],
  },
  { value: 'company.name', label: 'Company', type: 'text' },
  { value: 'city', label: 'City', type: 'text' },
  { value: 'createdAt', label: 'Created Date', type: 'date' },
];

const OPERATOR_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'is', label: 'is' },
  { value: 'equals', label: 'equals' },
  { value: 'contains', label: 'contains' },
  { value: 'startsWith', label: 'starts with' },
  { value: 'endsWith', label: 'ends with' },
  { value: 'doesNotContain', label: 'does not contain' },
];

const CONDITION_OPTIONS: Array<{ value: GroupCondition; label: string }> = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
  { value: 'AND NOT', label: 'AND NOT' },
];

const createId = () => Math.random().toString(36).slice(2, 10);

const getFieldOption = (value: string) => FIELD_OPTIONS.find(option => option.value === value);

const isGroupNode = (node: FilterNode): node is GroupNode => 'rules' in node;

const createEmptyRule = (): RuleNode => {
  const defaultField = FIELD_OPTIONS[0];
  const defaultValue = defaultField?.type === 'select' && defaultField.options?.length ? defaultField.options[0].value : '';

  return {
    id: createId(),
    field: defaultField?.value ?? '',
    operator: OPERATOR_OPTIONS[0].value,
    value: defaultValue,
    not: false,
  };
};

const createEmptyGroup = (): GroupNode => ({
  id: createId(),
  condition: 'AND',
  rules: [createEmptyRule()],
});

const addNodeToGroup = (group: GroupNode, groupId: string, node: FilterNode): GroupNode => {
  if (group.id === groupId) {
    return { ...group, rules: [...group.rules, node] };
  }

  return {
    ...group,
    rules: group.rules.map(child => (isGroupNode(child) ? addNodeToGroup(child, groupId, node) : child)),
  };
};

const updateRuleInTree = (group: GroupNode, ruleId: string, updater: (rule: RuleNode) => RuleNode): GroupNode => ({
  ...group,
  rules: group.rules.map(child => {
    if (isGroupNode(child)) {
      return updateRuleInTree(child, ruleId, updater);
    }
    if (child.id === ruleId) {
      return updater(child);
    }
    return child;
  }),
});

const updateGroupInTree = (group: GroupNode, groupId: string, updater: (current: GroupNode) => GroupNode): GroupNode => {
  if (group.id === groupId) {
    return updater(group);
  }

  return {
    ...group,
    rules: group.rules.map(child => (isGroupNode(child) ? updateGroupInTree(child, groupId, updater) : child)),
  };
};

const removeNodeFromTree = (group: GroupNode, nodeId: string): GroupNode => ({
  ...group,
  rules: group.rules
    .filter(child => {
      if (isGroupNode(child)) {
        return child.id !== nodeId;
      }
      return child.id !== nodeId;
    })
    .map(child => (isGroupNode(child) ? removeNodeFromTree(child, nodeId) : child)),
});

const formatRuleForExport = (rule: RuleNode) => {
  const payload: any = {
    field: rule.field,
    operator: rule.operator,
    value: rule.value,
  };

  if (rule.not) {
    payload.not = true;
  }

  return payload;
};

const formatGroupForExport = (group: GroupNode): any => {
  const normalizedCondition = group.condition === 'AND NOT' ? 'AND' : group.condition;
  const payload: any = {
    condition: normalizedCondition,
    rules: group.rules.map(child => (isGroupNode(child) ? formatGroupForExport(child) : formatRuleForExport(child))),
  };

  if (group.condition === 'AND NOT') {
    payload.not = true;
  }

  return payload;
};

const renderAvatar = (firstName: string, lastName: string) => {
  if (!firstName || !lastName) return <div className="avatar-placeholder">?</div>;
  return (
    <div className="avatar-circle">
      {firstName[0]}
      {lastName[0]}
    </div>
  );
};

const ProspectListPage = () => {
  const dispatch = useAppDispatch();
  const prospects: IProspect[] = useAppSelector(state => state.prospect.entities);
  const loading = useAppSelector(state => state.prospect.loading);
  const totalItems = useAppSelector(state => state.prospect.totalItems);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [sort, setSort] = useState('id,asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<Record<number, boolean>>({});
  const [advancedFilters, setAdvancedFilters] = useState<GroupNode>(() => ({
    id: createId(),
    condition: 'AND',
    rules: [createEmptyRule()],
  }));
  const [globalRule, setGlobalRule] = useState<RuleNode | null>(null);

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
    setPage(newPage - 1);
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddRule = (groupId: string) => {
    setAdvancedFilters(prev => addNodeToGroup(prev, groupId, createEmptyRule()));
  };

  const handleAddGroup = (groupId: string) => {
    setAdvancedFilters(prev => addNodeToGroup(prev, groupId, createEmptyGroup()));
  };

  const handleRuleFieldChange = (ruleId: string, field: string) => {
    const fieldOption = getFieldOption(field);
    const defaultValue = fieldOption?.type === 'select' && fieldOption.options?.length ? fieldOption.options[0].value : '';

    setAdvancedFilters(prev =>
      updateRuleInTree(prev, ruleId, rule => ({
        ...rule,
        field,
        value: defaultValue,
      })),
    );
  };

  const handleRuleOperatorChange = (ruleId: string, operator: string) => {
    setAdvancedFilters(prev => updateRuleInTree(prev, ruleId, rule => ({ ...rule, operator })));
  };

  const handleRuleValueChange = (ruleId: string, value: string) => {
    setAdvancedFilters(prev => updateRuleInTree(prev, ruleId, rule => ({ ...rule, value })));
  };

  const handleToggleRuleNot = (ruleId: string) => {
    setAdvancedFilters(prev => updateRuleInTree(prev, ruleId, rule => ({ ...rule, not: !rule.not })));
  };

  const handleRemoveRule = (ruleId: string) => {
    setAdvancedFilters(prev => removeNodeFromTree(prev, ruleId));
  };

  const handleGroupConditionChange = (groupId: string, condition: GroupCondition) => {
    setAdvancedFilters(prev => updateGroupInTree(prev, groupId, group => ({ ...group, condition })));
  };

  const handleRemoveGroup = (groupId: string) => {
    setAdvancedFilters(prev => {
      if (prev.id === groupId) {
        return prev;
      }
      return removeNodeFromTree(prev, groupId);
    });
  };

  const handleGlobalRuleFieldChange = (field: string) => {
    const fieldOption = getFieldOption(field);
    const defaultValue = fieldOption?.type === 'select' && fieldOption.options?.length ? fieldOption.options[0].value : '';

    setGlobalRule(prev =>
      prev
        ? {
            ...prev,
            field,
            value: defaultValue,
          }
        : null,
    );
  };

  const handleGlobalRuleOperatorChange = (operator: string) => {
    setGlobalRule(prev => (prev ? { ...prev, operator } : prev));
  };

  const handleGlobalRuleValueChange = (value: string) => {
    setGlobalRule(prev => (prev ? { ...prev, value } : prev));
  };

  const handleGlobalRuleToggleNot = () => {
    setGlobalRule(prev => (prev ? { ...prev, not: !prev.not } : prev));
  };

  const handleSearch = () => {
    const payload: any = formatGroupForExport(advancedFilters);
    if (globalRule) {
      payload.global = formatRuleForExport(globalRule);
    }

    // For now, simply log the JSON payload
    // eslint-disable-next-line no-console
    console.log('Advanced search payload', JSON.stringify(payload, null, 2));
  };

  const renderRule = (rule: RuleNode, parentGroup: GroupNode, index: number) => {
    const fieldOption = getFieldOption(rule.field);

    return (
      <div key={rule.id} className="filter-rule mb-3">
        {index > 0 ? <div className="logical-chip">{parentGroup.condition}</div> : null}
        <Row className="g-3 align-items-end">
          <Col md="3">
            <Label className="form-label text-muted">Field</Label>
            <Input type="select" value={rule.field} onChange={event => handleRuleFieldChange(rule.id, event.target.value)}>
              {FIELD_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Input>
          </Col>
          <Col md="3">
            <Label className="form-label text-muted">Operator</Label>
            <Input type="select" value={rule.operator} onChange={event => handleRuleOperatorChange(rule.id, event.target.value)}>
              {OPERATOR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Input>
          </Col>
          <Col md="4">
            <Label className="form-label text-muted">Value</Label>
            {fieldOption?.type === 'select' && fieldOption.options ? (
              <Input type="select" value={rule.value} onChange={event => handleRuleValueChange(rule.id, event.target.value)}>
                {fieldOption.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Input>
            ) : fieldOption?.type === 'date' ? (
              <Input type="date" value={rule.value} onChange={event => handleRuleValueChange(rule.id, event.target.value)} />
            ) : (
              <Input
                type="text"
                placeholder="Enter a value"
                value={rule.value}
                onChange={event => handleRuleValueChange(rule.id, event.target.value)}
              />
            )}
          </Col>
          <Col md="2" className="d-flex align-items-center gap-2">
            <FormGroup check className="mb-0">
              <Input type="checkbox" checked={!!rule.not} onChange={() => handleToggleRuleNot(rule.id)} />
              <Label check className="ms-1">
                NOT
              </Label>
            </FormGroup>
            <Button color="link" size="sm" className="text-danger" onClick={() => handleRemoveRule(rule.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  const renderGroup = (group: GroupNode, isRoot = false) => (
    <div key={group.id} className={`filter-group ${isRoot ? 'filter-group-root' : ''}`}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted fw-semibold">{isRoot ? 'Root Condition' : 'Condition'}</span>
          <Input
            type="select"
            value={group.condition}
            onChange={event => handleGroupConditionChange(group.id, event.target.value as GroupCondition)}
            className="filter-condition-select"
          >
            {CONDITION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
        </div>
        {!isRoot ? (
          <Button color="link" size="sm" className="text-danger" onClick={() => handleRemoveGroup(group.id)}>
            <FontAwesomeIcon icon={faTrash} className="me-1" /> Remove group
          </Button>
        ) : null}
      </div>
      <div className="filter-group-body">
        {group.rules.map((node, index) => (isGroupNode(node) ? renderGroup(node) : renderRule(node, group, index)))}
      </div>
      <div className="d-flex gap-2 mt-3">
        <Button outline size="sm" color="primary" onClick={() => handleAddRule(group.id)}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Rule
        </Button>
        <Button outline size="sm" color="secondary" onClick={() => handleAddGroup(group.id)}>
          <FontAwesomeIcon icon={faLayerGroup} className="me-1" /> Group
        </Button>
      </div>
    </div>
  );

  const renderGlobalRule = () => {
    if (!globalRule) {
      return null;
    }

    const fieldOption = getFieldOption(globalRule.field);

    return (
      <div className="global-rule border rounded bg-white p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Global Rule</h6>
          <Button color="link" size="sm" className="text-danger" onClick={() => setGlobalRule(null)}>
            <FontAwesomeIcon icon={faTrash} className="me-1" /> Remove
          </Button>
        </div>
        <Row className="g-3 align-items-end">
          <Col md="3">
            <Label className="form-label text-muted">Field</Label>
            <Input type="select" value={globalRule.field} onChange={event => handleGlobalRuleFieldChange(event.target.value)}>
              {FIELD_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Input>
          </Col>
          <Col md="3">
            <Label className="form-label text-muted">Operator</Label>
            <Input type="select" value={globalRule.operator} onChange={event => handleGlobalRuleOperatorChange(event.target.value)}>
              {OPERATOR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Input>
          </Col>
          <Col md="4">
            <Label className="form-label text-muted">Value</Label>
            {fieldOption?.type === 'select' && fieldOption.options ? (
              <Input type="select" value={globalRule.value} onChange={event => handleGlobalRuleValueChange(event.target.value)}>
                {fieldOption.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Input>
            ) : fieldOption?.type === 'date' ? (
              <Input type="date" value={globalRule.value} onChange={event => handleGlobalRuleValueChange(event.target.value)} />
            ) : (
              <Input
                type="text"
                placeholder="Enter a value"
                value={globalRule.value}
                onChange={event => handleGlobalRuleValueChange(event.target.value)}
              />
            )}
          </Col>
          <Col md="2" className="d-flex align-items-center gap-2">
            <FormGroup check className="mb-0">
              <Input type="checkbox" checked={!!globalRule.not} onChange={handleGlobalRuleToggleNot} />
              <Label check className="ms-1">
                NOT
              </Label>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div>
      <Card className="mb-4 shadow-sm border">
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Prospects</h5>
          <div className="d-flex gap-2">
            <div className="d-flex align-items-center border rounded px-2" style={{ minWidth: '200px' }}>
              <FontAwesomeIcon icon={faSearch} className="text-muted me-2" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                className="border-0 py-1"
                style={{ width: '100%' }}
              />
            </div>
            <Button color="secondary" size="sm">
              <FontAwesomeIcon icon={faFilter} className="me-1" /> Filter
            </Button>
            <Button color="primary" size="sm" tag={Link} to="/dashboard/contact/new">
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Prospect
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="advanced-search-card mb-4 shadow-sm border-0">
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recherche Avancee</h5>
          {!globalRule ? (
            <Button outline size="sm" color="secondary" onClick={() => setGlobalRule(createEmptyRule())}>
              <FontAwesomeIcon icon={faGlobe} className="me-1" /> Global rule
            </Button>
          ) : null}
        </CardHeader>
        <CardBody>
          {renderGlobalRule()}
          {renderGroup(advancedFilters, true)}
          <div className="d-flex justify-content-end mt-3">
            <Button color="primary" onClick={handleSearch} disabled={loading}>
              <FontAwesomeIcon icon={faSearch} className="me-2" /> Search
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-sm border">
        <CardBody className="p-0">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer' }}>
                  Name{' '}
                  <FontAwesomeIcon
                    icon={sort === 'firstName,asc' ? faSortUp : sort === 'firstName,desc' ? faSortDown : faSort}
                    size="sm"
                    className="ms-1 text-muted"
                  />
                </th>
                <th onClick={() => handleSort('phone1')} style={{ cursor: 'pointer' }}>
                  Phone{' '}
                  <FontAwesomeIcon
                    icon={sort === 'phone1,asc' ? faSortUp : sort === 'phone1,desc' ? faSortDown : faSort}
                    size="sm"
                    className="ms-1 text-muted"
                  />
                </th>
                <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                  Email{' '}
                  <FontAwesomeIcon
                    icon={sort === 'email,asc' ? faSortUp : sort === 'email,desc' ? faSortDown : faSort}
                    size="sm"
                    className="ms-1 text-muted"
                  />
                </th>
                <th onClick={() => handleSort('company')} style={{ cursor: 'pointer' }}>
                  Company{' '}
                  <FontAwesomeIcon
                    icon={sort === 'company,asc' ? faSortUp : sort === 'company,desc' ? faSortDown : faSort}
                    size="sm"
                    className="ms-1 text-muted"
                  />
                </th>
                <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                  Created Date{' '}
                  <FontAwesomeIcon
                    icon={sort === 'createdAt,asc' ? faSortUp : sort === 'createdAt,desc' ? faSortDown : faSort}
                    size="sm"
                    className="ms-1 text-muted"
                  />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {prospects.map(prospect => (
                <tr key={prospect.id} className="align-middle">
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {renderAvatar(prospect.firstName, prospect.lastName)}
                      <span>
                        {prospect.firstName} {prospect.lastName}
                      </span>
                    </div>
                  </td>
                  <td>{prospect.phone1 || '--'}</td>
                  <td>{prospect.email}</td>
                  <td>{prospect.company?.name || '--'}</td>
                  <td>{dayjs(prospect.createdAt).format('DD MMM YYYY')}</td>
                  <td>
                    <Dropdown isOpen={dropdownOpen[prospect.id]} toggle={() => toggleDropdown(prospect.id)}>
                      <DropdownToggle color="link" className="p-0 text-muted">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </DropdownToggle>
                      <DropdownMenu end className="rounded-3 shadow">
                        <DropdownItem tag="a" href={`/prospect/${prospect.id}`}>
                          <FontAwesomeIcon icon={faEye} className="me-2" /> View
                        </DropdownItem>
                        <DropdownItem tag="a" href={`/prospect/${prospect.id}/edit`}>
                          <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem color="danger" onClick={() => alert(`Delete ${prospect.id}`)}>
                          <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalItems > size && (
            <div className="d-flex justify-content-end p-3">
              <Pagination className="m-0">
                <PaginationItem disabled={page === 0}>
                  <PaginationLink previous onClick={() => handlePageChange(page)} />
                </PaginationItem>
                {[...Array(Math.ceil(totalItems / size))].map((_, i) => (
                  <PaginationItem key={i + 1} active={i === page}>
                    <PaginationLink onClick={() => handlePageChange(i + 1)}>{i + 1}</PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem disabled={page >= Math.ceil(totalItems / size) - 1}>
                  <PaginationLink next onClick={() => handlePageChange(page + 2)} />
                </PaginationItem>
              </Pagination>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProspectListPage;
