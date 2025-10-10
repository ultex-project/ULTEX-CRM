import dayjs from 'dayjs';
import { IClient } from 'app/shared/model/client.model';

export interface IHistoriqueCRM {
  id?: number;
  dateInteraction?: dayjs.Dayjs;
  canal?: string | null;
  agent?: string | null;
  resume?: string | null;
  etat?: string | null;
  observation?: string | null;
  client?: IClient | null;
}

export const defaultValue: Readonly<IHistoriqueCRM> = {};
