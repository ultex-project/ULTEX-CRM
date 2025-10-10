import { IClient } from 'app/shared/model/client.model';

export interface IDocumentClient {
  id?: number;
  typeDocument?: string;
  numeroDocument?: string | null;
  fichierUrl?: string | null;
  client?: IClient | null;
}

export const defaultValue: Readonly<IDocumentClient> = {};
