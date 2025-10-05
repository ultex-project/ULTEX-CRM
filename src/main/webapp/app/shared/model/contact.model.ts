import dayjs from 'dayjs';
import { ICompany } from 'app/shared/model/company.model';
import { IClient } from 'app/shared/model/client.model';
import { IProspect } from 'app/shared/model/prospect.model';

export interface IContact {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  cin?: string | null;
  position?: string | null;
  quality?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  company?: ICompany;
  client?: IClient | null;
  prospect?: IProspect | null;
}

export const defaultValue: Readonly<IContact> = {};
