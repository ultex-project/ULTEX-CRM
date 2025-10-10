export type FieldInputType = 'text' | 'select' | 'date';

export interface FieldOption {
  value: string;
  label: string;
  type: FieldInputType;
  options?: Array<{ value: string; label: string }>;
}

export interface RuleNode {
  id: string;
  field: string;
  operator: string;
  value: string;
  not?: boolean;
}

export type GroupCondition = 'AND' | 'OR' | 'AND NOT';

export interface GroupNode {
  id: string;
  condition: GroupCondition;
  rules: Array<GroupNode | RuleNode>;
}

export type FilterNode = GroupNode | RuleNode;

export interface AdvancedFilterPayload {
  rootGroup: GroupNode;
  globalRule?: RuleNode | null;
}

export const isGroupNode = (node: FilterNode): node is GroupNode => 'rules' in node;
