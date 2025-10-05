import dayjs from 'dayjs';
import { IClient } from 'app/shared/model/client.model';

export interface IDemandeClient {
  id?: number;
  reference?: string;
  dateDemande?: dayjs.Dayjs;
  servicePrincipal?: string | null;
  sousServices?: string | null;
  provenance?: string | null;
  incoterm?: string | null;
  devise?: string | null;
  nombreProduits?: number | null;
  remarqueGenerale?: string | null;
  client?: IClient | null;
}

export const defaultValue: Readonly<IDemandeClient> = {};
