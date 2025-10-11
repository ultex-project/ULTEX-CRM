import React, { useMemo, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faLayerGroup, faPlus, faRotateLeft, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';

import { AdvancedFilterPayload, FieldOption, GroupCondition, GroupNode, RuleNode, isGroupNode } from '../advanced-filter.types';

interface AdvancedFilterBuilderProps {
  isSearching?: boolean;
  onSearch: (payload: AdvancedFilterPayload) => void;
  onReset?: () => void;
}

const FIELD_OPTIONS: FieldOption[] = [
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
  { value: 'firstName', label: 'First name', type: 'text' },
  { value: 'lastName', label: 'Last name', type: 'text' },
  { value: 'email', label: 'Email', type: 'text' },
  { value: 'city', label: 'City', type: 'text' },
  { value: 'country', label: 'Country', type: 'text' },
  { value: 'companyId', label: 'Company', type: 'text' },
  { value: 'createdAt', label: 'Created date', type: 'date' },
];

const OPERATOR_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'equals', label: 'equals' },
  { value: 'contains', label: 'contains' },
  { value: 'notEquals', label: 'is not' },
  { value: 'doesNotContain', label: 'does not contain' },
  { value: 'specified', label: 'is specified' },
  { value: 'notSpecified', label: 'is not specified' },
];

const CONDITION_OPTIONS: Array<{ value: GroupCondition; label: string }> = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
  { value: 'AND NOT', label: 'AND NOT' },
];

const createId = () => Math.random().toString(36).slice(2, 10);

const getFieldOption = (value: string) => FIELD_OPTIONS.find(option => option.value === value);

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

const addNodeToGroup = (group: GroupNode, groupId: string, node: RuleNode | GroupNode): GroupNode => {
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

const AdvancedFilterBuilder: React.FC<AdvancedFilterBuilderProps> = ({ isSearching = false, onReset, onSearch }) => {
  const [advancedFilters, setAdvancedFilters] = useState<GroupNode>(() => createEmptyGroup());
  const [globalRule, setGlobalRule] = useState<RuleNode | null>(null);

  const hasGlobalRule = useMemo(() => !!globalRule, [globalRule]);

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
    setAdvancedFilters(prev =>
      updateRuleInTree(prev, ruleId, rule => ({
        ...rule,
        operator,
        value: operator === 'specified' ? 'true' : operator === 'notSpecified' ? 'false' : rule.value,
      })),
    );
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
    setGlobalRule(prev =>
      prev
        ? {
            ...prev,
            operator,
            value: operator === 'specified' ? 'true' : operator === 'notSpecified' ? 'false' : prev.value,
          }
        : prev,
    );
  };

  const handleGlobalRuleValueChange = (value: string) => {
    setGlobalRule(prev => (prev ? { ...prev, value } : prev));
  };

  const handleGlobalRuleToggleNot = () => {
    setGlobalRule(prev => (prev ? { ...prev, not: !prev.not } : prev));
  };

  const handleCreateGlobalRule = () => {
    if (!globalRule) {
      setGlobalRule(createEmptyRule());
    }
  };

  const handleRemoveGlobalRule = () => {
    setGlobalRule(null);
  };

  const handleSearchClick = () => {
    onSearch({
      rootGroup: advancedFilters,
      globalRule,
    });
  };

  const handleResetClick = () => {
    setAdvancedFilters(createEmptyGroup());
    setGlobalRule(null);
    onReset?.();
  };

  const renderRule = (rule: RuleNode, parentGroup: GroupNode, index: number) => {
    const fieldOption = getFieldOption(rule.field);
    const skipValueInput = rule.operator === 'specified' || rule.operator === 'notSpecified';

    const renderValueInput = () => {
      if (skipValueInput) {
        return null;
      }

      if (fieldOption?.type === 'select' && fieldOption.options) {
        return (
          <Input type="select" value={rule.value} onChange={event => handleRuleValueChange(rule.id, event.target.value)}>
            {fieldOption.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
        );
      }

      if (fieldOption?.type === 'date') {
        const displayValue = rule.value ? rule.value.slice(0, 10) : '';
        return (
          <Input
            type="date"
            value={displayValue}
            onChange={event => {
              const nextValue = event.target.value ? `${event.target.value}T00:00:00Z` : '';
              handleRuleValueChange(rule.id, nextValue);
            }}
          />
        );
      }

      return (
        <Input
          type="text"
          placeholder="Enter a value"
          value={rule.value}
          onChange={event => handleRuleValueChange(rule.id, event.target.value)}
        />
      );
    };

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
            {skipValueInput ? (
              <div className="text-muted small">{rule.operator === 'specified' ? 'true' : 'false'}</div>
            ) : (
              renderValueInput()
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
    const skipValueInput = globalRule.operator === 'specified' || globalRule.operator === 'notSpecified';

    const renderValueInput = () => {
      if (skipValueInput) {
        return null;
      }

      if (fieldOption?.type === 'select' && fieldOption.options) {
        return (
          <Input type="select" value={globalRule.value} onChange={event => handleGlobalRuleValueChange(event.target.value)}>
            {fieldOption.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
        );
      }

      if (fieldOption?.type === 'date') {
        const displayValue = globalRule.value ? globalRule.value.slice(0, 10) : '';
        return (
          <Input
            type="date"
            value={displayValue}
            onChange={event => handleGlobalRuleValueChange(event.target.value ? `${event.target.value}T00:00:00Z` : '')}
          />
        );
      }

      return (
        <Input
          type="text"
          placeholder="Enter a value"
          value={globalRule.value}
          onChange={event => handleGlobalRuleValueChange(event.target.value)}
        />
      );
    };

    return (
      <div className="global-rule border rounded bg-white p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Global rule</h6>
          <Button color="link" size="sm" className="text-danger" onClick={handleRemoveGlobalRule}>
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
            {skipValueInput ? (
              <div className="text-muted small">{globalRule.operator === 'specified' ? 'true' : 'false'}</div>
            ) : (
              renderValueInput()
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
    <Card className="prospect-advanced-card shadow-sm border-0">
      <CardHeader className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Advanced filters</h5>
        {!hasGlobalRule ? (
          <Button outline size="sm" color="secondary" onClick={handleCreateGlobalRule}>
            <FontAwesomeIcon icon={faGlobe} className="me-1" /> Global rule
          </Button>
        ) : null}
      </CardHeader>
      <CardBody>
        {renderGlobalRule()}
        {renderGroup(advancedFilters, true)}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-4">
          <div className="text-muted small">Combine groups and rules to target exactly the prospects you need.</div>
          <div className="d-flex gap-2">
            <Button color="link" className="text-danger px-0" onClick={handleResetClick}>
              <FontAwesomeIcon icon={faRotateLeft} className="me-2" /> Reset
            </Button>
            <Button color="primary" onClick={handleSearchClick} disabled={isSearching}>
              {isSearching ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSearch} className="me-2" />}
              Apply filters
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AdvancedFilterBuilder;
