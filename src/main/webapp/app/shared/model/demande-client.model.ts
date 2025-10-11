import dayjs from 'dayjs';
import { IClient } from 'app/shared/model/client.model';
import { IDevise } from 'app/shared/model/devise.model';
import { IIncoterm } from 'app/shared/model/incoterm.model';

export interface IDemandeClient {
  id?: number;
  reference?: string;
  dateDemande?: dayjs.Dayjs;
  servicePrincipal?: string | null;
  sousServices?: string | null;
  provenance?: string | null;
  nombreProduits?: number | null;
  remarqueGenerale?: string | null;
  client?: IClient | null;
  devise?: IDevise | null;
  incoterm?: IIncoterm | null;
}

export const defaultValue: Readonly<IDemandeClient> = {};
