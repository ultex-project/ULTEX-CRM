import { IDemandeClient } from 'app/shared/model/demande-client.model';

export interface ISousService {
  id?: number;
  code?: string;
  libelle?: string;
  demandes?: IDemandeClient[] | null;
}

export const defaultValue: Readonly<ISousService> = {};
