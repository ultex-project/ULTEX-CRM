import { AdvancedFilterPayload, GroupNode, RuleNode, isGroupNode } from 'app/custom/dashboard/modules/advanced-filter.types';

interface FlattenedRule {
  rule: RuleNode;
  negate: boolean;
}

interface FlattenResult {
  rules: FlattenedRule[];
  hasOrCondition: boolean;
}

const HTTP_OPERATOR_MAP: Record<string, string> = {
  equals: 'equals',
  notEquals: 'notEquals',
  contains: 'contains',
  doesNotContain: 'doesNotContain',
  specified: 'specified',
  notSpecified: 'specified',
};

const NEGATED_HTTP_OPERATOR_MAP: Record<string, string> = {
  equals: 'notEquals',
  notEquals: 'equals',
  contains: 'doesNotContain',
  doesNotContain: 'contains',
  specified: 'specified',
};

const buildRuleQueryString = (rule: RuleNode, negate: boolean): string | null => {
  const fieldKey = rule.field?.trim();
  if (!fieldKey) {
    return null;
  }

  const normalizedOperator = HTTP_OPERATOR_MAP[rule.operator] ?? 'contains';
  const operatorKey = negate ? (NEGATED_HTTP_OPERATOR_MAP[normalizedOperator] ?? normalizedOperator) : normalizedOperator;

  let value = rule.value?.toString().trim() ?? '';

  if (normalizedOperator === 'specified') {
    const baseValue = rule.operator === 'notSpecified' ? 'false' : 'true';
    value = negate ? (baseValue === 'true' ? 'false' : 'true') : baseValue;
  }

  if (!value && operatorKey !== 'specified') {
    return null;
  }

  const encodedKey = encodeURIComponent(`${fieldKey}.${operatorKey}`);
  const encodedValue = encodeURIComponent(value);
  return `${encodedKey}=${encodedValue}`;
};

const flattenFilterGroup = (group: GroupNode, inheritedNegate = false): FlattenResult => {
  const groupNegate = inheritedNegate || group.condition === 'AND NOT';
  let hasOrCondition = group.condition === 'OR';
  const collected: FlattenedRule[] = [];

  group.rules.forEach(child => {
    if (isGroupNode(child)) {
      const nested = flattenFilterGroup(child, groupNegate);
      collected.push(...nested.rules);
      if (child.condition === 'OR' || nested.hasOrCondition) {
        hasOrCondition = true;
      }
    } else {
      collected.push({ rule: child, negate: groupNegate || !!child.not });
    }
  });

  return { rules: collected, hasOrCondition };
};

export const buildQueryStringFromAdvancedFilters = (payload: AdvancedFilterPayload) => {
  const { rules, hasOrCondition } = flattenFilterGroup(payload.rootGroup);
  const fragments: string[] = [];

  rules.forEach(item => {
    const fragment = buildRuleQueryString(item.rule, item.negate);
    if (fragment) {
      fragments.push(fragment);
    }
  });

  if (payload.globalRule) {
    const fragment = buildRuleQueryString(payload.globalRule, !!payload.globalRule.not);
    if (fragment) {
      fragments.push(fragment);
    }
  }

  return {
    hasOrCondition,
    query: fragments.join('&'),
  };
};
