import { IClient } from 'app/shared/model/client.model';

export interface IContactAssocie {
  id?: number;
  nom?: string;
  prenom?: string;
  relation?: string | null;
  telephone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  autorisation?: string | null;
  remarques?: string | null;
  client?: IClient | null;
}

export const defaultValue: Readonly<IContactAssocie> = {};
