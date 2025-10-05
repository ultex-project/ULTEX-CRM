import dayjs from 'dayjs';
import { IClient } from 'app/shared/model/client.model';
import { IInternalUser } from 'app/shared/model/internal-user.model';
import { ICompany } from 'app/shared/model/company.model';
import { ProspectStatus } from 'app/shared/model/enumerations/prospect-status.model';

export interface IProspect {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone1?: string | null;
  phone2?: string | null;
  source?: string | null;
  cin?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  deliveryAddress?: string | null;
  referredBy?: string | null;
  status?: keyof typeof ProspectStatus;
  convertedDate?: dayjs.Dayjs | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  convertedTo?: IClient | null;
  convertedBy?: IInternalUser;
  company?: ICompany | null;
}

export const defaultValue: Readonly<IProspect> = {};
