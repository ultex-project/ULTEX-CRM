import React from 'react';
import './status-badge.scss';

export type StatusBadgeVariant = 'pipeline' | 'active' | 'completed' | 'pending' | 'failed';

type StatusBadgeProps = {
  status: string;
  label?: string;
  className?: string;
};

const KNOWN_VARIANTS: StatusBadgeVariant[] = ['pipeline', 'active', 'completed', 'pending', 'failed'];

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const normalized = status.toLowerCase();
  const variant = (KNOWN_VARIANTS as string[]).includes(normalized) ? normalized : 'default';

  const classes = ['status-badge', `status-badge--${variant}`];
  if (className) {
    classes.push(className);
  }

  return <span className={classes.join(' ')}>{(label || status).toUpperCase()}</span>;
};

export default StatusBadge;
