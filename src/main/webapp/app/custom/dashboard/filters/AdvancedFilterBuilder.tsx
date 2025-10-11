import React, { useMemo, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faPlus, faRotateLeft, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';

export interface FieldOption {
  value: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: Array<{ value: string; label: string }>;
}

export type GroupCondition = 'AND' | 'OR' | 'AND NOT';

export interface RuleNode {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface GroupNode {
  id: string;
  condition: GroupCondition;
  rules: Array<RuleNode | GroupNode>;
}

export interface AdvancedFilterPayload {
  rootGroup: GroupNode;
}

export interface AdvancedFilterBuilderProps {
  title?: string;
  fields: FieldOption[];
  isSearching?: boolean;
  onSearch: (payload: AdvancedFilterPayload) => void;
  onReset?: () => void;
}

const OPERATORS = [
  { value: 'equals', label: 'égal à' },
  { value: 'contains', label: 'contient' },
  { value: 'notEquals', label: 'n’est pas' },
  { value: 'doesNotContain', label: 'ne contient pas' },
  { value: 'specified', label: 'est spécifié' },
  { value: 'notSpecified', label: 'n’est pas spécifié' },
];

const CONDITIONS: Array<{ value: GroupCondition; label: string }> = [
  { value: 'AND', label: 'ET' },
  { value: 'OR', label: 'OU' },
  { value: 'AND NOT', label: 'ET NON' },
];

const createId = () => Math.random().toString(36).slice(2, 10);
const isGroupNode = (node: RuleNode | GroupNode): node is GroupNode => (node as GroupNode).rules !== undefined;

const AdvancedFilterBuilder: React.FC<AdvancedFilterBuilderProps> = ({
  title = 'Filtres avancés',
  fields,
  isSearching = false,
  onSearch,
  onReset,
}) => {
  const createEmptyRule = (): RuleNode => ({
    id: createId(),
    field: fields[0]?.value ?? '',
    operator: OPERATORS[0].value,
    value: '',
  });

  const createEmptyGroup = (): GroupNode => ({
    id: createId(),
    condition: 'AND',
    rules: [createEmptyRule()],
  });

  const [filters, setFilters] = useState<GroupNode>(() => createEmptyGroup());

  const addRule = (groupId: string) => {
    const addRec = (g: GroupNode): GroupNode =>
      g.id === groupId
        ? { ...g, rules: [...g.rules, createEmptyRule()] }
        : { ...g, rules: g.rules.map(r => (isGroupNode(r) ? addRec(r) : r)) };
    setFilters(prev => addRec(prev));
  };

  const addGroup = (groupId: string) => {
    const addRec = (g: GroupNode): GroupNode =>
      g.id === groupId
        ? { ...g, rules: [...g.rules, createEmptyGroup()] }
        : { ...g, rules: g.rules.map(r => (isGroupNode(r) ? addRec(r) : r)) };
    setFilters(prev => addRec(prev));
  };

  const removeNode = (group: GroupNode, id: string): GroupNode => ({
    ...group,
    rules: group.rules.filter(r => r.id !== id).map(r => (isGroupNode(r) ? removeNode(r, id) : r)),
  });

  const updateRule = (id: string, updater: (r: RuleNode) => RuleNode) => {
    const updateRec = (g: GroupNode): GroupNode => ({
      ...g,
      rules: g.rules.map(r => {
        if (isGroupNode(r)) return updateRec(r);
        if (r.id === id) return updater(r);
        return r;
      }),
    });
    setFilters(prev => updateRec(prev));
  };

  const renderRule = (rule: RuleNode, parent: GroupNode, index: number) => {
    const fieldDef = fields.find(f => f.value === rule.field);
    const skipValue = rule.operator === 'specified' || rule.operator === 'notSpecified';

    return (
      <div key={rule.id} className="filter-rule mb-3">
        {index > 0 && <div className="logical-chip">{parent.condition}</div>}
        <Row className="g-3 align-items-end">
          <Col md="3">
            <Label className="form-label text-muted">Champ</Label>
            <Input type="select" value={rule.field} onChange={e => updateRule(rule.id, r => ({ ...r, field: e.target.value }))}>
              {fields.map(f => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Input>
          </Col>
          <Col md="3">
            <Label className="form-label text-muted">Opérateur</Label>
            <Input type="select" value={rule.operator} onChange={e => updateRule(rule.id, r => ({ ...r, operator: e.target.value }))}>
              {OPERATORS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Input>
          </Col>
          <Col md="4">
            <Label className="form-label text-muted">Valeur</Label>
            {!skipValue && (
              <>
                {fieldDef?.type === 'select' && fieldDef.options ? (
                  <Input type="select" value={rule.value} onChange={e => updateRule(rule.id, r => ({ ...r, value: e.target.value }))}>
                    {fieldDef.options.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Input>
                ) : fieldDef?.type === 'date' ? (
                  <Input type="date" value={rule.value} onChange={e => updateRule(rule.id, r => ({ ...r, value: e.target.value }))} />
                ) : (
                  <Input type="text" value={rule.value} onChange={e => updateRule(rule.id, r => ({ ...r, value: e.target.value }))} />
                )}
              </>
            )}
          </Col>
          <Col md="2" className="d-flex align-items-center justify-content-end">
            <Button color="link" size="sm" className="text-danger" onClick={() => setFilters(prev => removeNode(prev, rule.id))}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  const renderGroup = (group: GroupNode, isRoot = false) => (
    <div key={group.id} className="filter-group mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          <Label className="fw-semibold text-muted mb-0">{isRoot ? 'Condition principale' : 'Condition'}</Label>
          <Input
            type="select"
            value={group.condition}
            onChange={e => {
              const cond = e.target.value as GroupCondition;
              const updateCond = (g: GroupNode): GroupNode =>
                g.id === group.id ? { ...g, condition: cond } : { ...g, rules: g.rules.map(r => (isGroupNode(r) ? updateCond(r) : r)) };
              setFilters(prev => updateCond(prev));
            }}
          >
            {CONDITIONS.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Input>
        </div>
        {!isRoot && (
          <Button color="link" size="sm" className="text-danger" onClick={() => setFilters(prev => removeNode(prev, group.id))}>
            <FontAwesomeIcon icon={faTrash} className="me-1" /> Supprimer
          </Button>
        )}
      </div>

      {group.rules.map((r, i) => (isGroupNode(r) ? renderGroup(r) : renderRule(r, group, i)))}

      <div className="d-flex gap-2 mt-2">
        <Button outline size="sm" color="primary" onClick={() => addRule(group.id)}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Règle
        </Button>
        <Button outline size="sm" color="secondary" onClick={() => addGroup(group.id)}>
          <FontAwesomeIcon icon={faLayerGroup} className="me-1" /> Groupe
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="advanced-filter-card shadow-sm border-0">
      <CardHeader className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
      </CardHeader>
      <CardBody>
        {renderGroup(filters, true)}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            color="link"
            className="text-danger px-0"
            onClick={() => {
              setFilters(createEmptyGroup());
              onReset?.();
            }}
          >
            <FontAwesomeIcon icon={faRotateLeft} className="me-2" /> Réinitialiser
          </Button>
          <Button color="primary" onClick={() => onSearch({ rootGroup: filters })} disabled={isSearching}>
            {isSearching ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSearch} className="me-2" />}
            Appliquer les filtres
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default AdvancedFilterBuilder;
