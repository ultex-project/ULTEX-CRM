import dayjs from 'dayjs';
import { UserRole } from 'app/shared/model/enumerations/user-role.model';

export interface IInternalUser {
  id?: number;
  fullName?: string;
  role?: keyof typeof UserRole;
  email?: string;
  phone?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
}

export const defaultValue: Readonly<IInternalUser> = {};
