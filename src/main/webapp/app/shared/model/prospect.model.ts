import { IClient } from 'app/shared/model/client.model';
import { IInternalUser } from 'app/shared/model/internal-user.model';
import { ProspectStatus } from 'app/shared/model/enumerations/prospect-status.model';

export interface IProspect {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  source?: string | null;
  status?: keyof typeof ProspectStatus;
  convertedTo?: IClient | null;
  convertedBy?: IInternalUser | null;
}

export const defaultValue: Readonly<IProspect> = {};
