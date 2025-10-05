import { IClient } from 'app/shared/model/client.model';

export interface IKycClient {
  id?: number;
  scoreStaff?: number | null;
  comportements?: string | null;
  remarques?: string | null;
  completudeKyc?: number | null;
  responsable?: string | null;
  client?: IClient | null;
}

export const defaultValue: Readonly<IKycClient> = {};
