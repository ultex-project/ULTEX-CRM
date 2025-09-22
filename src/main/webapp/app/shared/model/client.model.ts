import { ClientStatus } from 'app/shared/model/enumerations/client-status.model';

export interface IClient {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  status?: keyof typeof ClientStatus;
}

export const defaultValue: Readonly<IClient> = {};
