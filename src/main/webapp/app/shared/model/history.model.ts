import dayjs from 'dayjs';

export interface IHistory {
  id?: number;
  entityName?: string;
  entityId?: number;
  action?: string;
  fieldChanged?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  performedBy?: string;
  performedDate?: dayjs.Dayjs;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export const defaultValue: Readonly<IHistory> = {};
