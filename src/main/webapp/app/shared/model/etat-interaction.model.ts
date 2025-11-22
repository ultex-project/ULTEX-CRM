import dayjs from 'dayjs';
import { IHistoriqueCRM } from 'app/shared/model/historique-crm.model';
import { ICycleActivation } from 'app/shared/model/cycle-activation.model';
import { EtatCRM } from 'app/shared/model/enumerations/etat-crm.model';

export interface IEtatInteraction {
  id?: number;
  etat?: keyof typeof EtatCRM;
  dateEtat?: dayjs.Dayjs;
  agent?: string | null;
  observation?: string | null;
  historique?: IHistoriqueCRM | null;
  cycle?: ICycleActivation;
}

export const defaultValue: Readonly<IEtatInteraction> = {};
