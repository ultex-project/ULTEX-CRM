import dayjs from 'dayjs';
import { IClient } from 'app/shared/model/client.model';

export interface ICycleActivation {
  id?: number;
  numeroCycle?: number;
  dateDebut?: dayjs.Dayjs;
  dateFin?: dayjs.Dayjs | null;
  statutCycle?: string | null;
  commentaire?: string | null;
  client?: IClient;
}

export const defaultValue: Readonly<ICycleActivation> = {};
