import dayjs from 'dayjs';
import { IInternalUser } from 'app/shared/model/internal-user.model';
import { IClient } from 'app/shared/model/client.model';
import { OpportunityStage } from 'app/shared/model/enumerations/opportunity-stage.model';

export interface IOpportunity {
  id?: number;
  title?: string;
  description?: string | null;
  amount?: number;
  stage?: keyof typeof OpportunityStage;
  closeDate?: dayjs.Dayjs | null;
  assignedTo?: IInternalUser | null;
  client?: IClient | null;
}

export const defaultValue: Readonly<IOpportunity> = {};
