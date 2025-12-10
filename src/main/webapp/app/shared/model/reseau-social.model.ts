import { IClient } from 'app/shared/model/client.model';
import { PlateformeSociale } from 'app/shared/model/enumerations/plateforme-sociale.model';

export interface IReseauSocial {
  id?: number;
  plateforme?: keyof typeof PlateformeSociale;
  urlProfil?: string | null;
  username?: string | null;
  type?: string | null;
  client?: IClient;
}

export const defaultValue: Readonly<IReseauSocial> = {};
