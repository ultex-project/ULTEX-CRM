import dayjs from 'dayjs';
import { ICompany } from 'app/shared/model/company.model';
import { ClientStatus } from 'app/shared/model/enumerations/client-status.model';

export interface IClient {
  id?: number;
  clientId?: number | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone1?: string | null;
  phone2?: string | null;
  cin?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  deliveryAddress?: string | null;
  referredBy?: string | null;
  status?: keyof typeof ClientStatus;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  company?: ICompany | null;
}

export const defaultValue: Readonly<IClient> = {};
