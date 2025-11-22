import dayjs from 'dayjs';
import { IEtatInteraction } from 'app/shared/model/etat-interaction.model';
import { IClient } from 'app/shared/model/client.model';
import { IInternalUser } from 'app/shared/model/internal-user.model';
import { StatutRappel } from 'app/shared/model/enumerations/statut-rappel.model';

export interface IRappelAgent {
  id?: number;
  rappelDate?: dayjs.Dayjs;
  rappelMessage?: string | null;
  statutRappel?: keyof typeof StatutRappel;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  etat?: IEtatInteraction | null;
  client?: IClient | null;
  agent?: IInternalUser | null;
}

export const defaultValue: Readonly<IRappelAgent> = {};
