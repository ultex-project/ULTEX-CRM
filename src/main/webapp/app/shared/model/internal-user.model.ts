import { UserRole } from 'app/shared/model/enumerations/user-role.model';

export interface IInternalUser {
  id?: number;
  fullName?: string;
  role?: keyof typeof UserRole;
}

export const defaultValue: Readonly<IInternalUser> = {};
